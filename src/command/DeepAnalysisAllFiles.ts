import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { DeepAnalysisResult, TAhkSymbolList } from '../globalEnum';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';

export async function DeepAnalysisAllFiles(): Promise<null> {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    let argMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    const need: DeepAnalysisResult[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | null = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) continue;

        const Uri = vscode.Uri.file(fsPath);
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(Uri);
        for (const ahkSymbol of AhkSymbolList) {
            const ed = DeepAnalysis(document, ahkSymbol);
            if (ed === null) continue;

            need.push(ed);
            argMapSize += ed.argMap.size;
            valMapSize += ed.valMap.size;
            textMapSize += ed.textMap.size;
        }
    }

    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${need.length} Symbol`);
    OutputChannel.appendLine(`argMapSize is ${argMapSize}`);
    OutputChannel.appendLine(`valMapSize is ${valMapSize}`);
    OutputChannel.appendLine(`textMapSize is ${textMapSize}`);
    OutputChannel.appendLine(`All Size is ${argMapSize + valMapSize + textMapSize}`);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 809 Symbol
argMapSize is 2231 <--keep 2231!
valMapSize is 2050
textMapSize is 2921 <- next plan: ignore keyWord.
All Size is 7202
Done in 491 ms
*/
