/* eslint-disable max-statements */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { diagColl } from '../core/diagRoot';
import { DeepAnalysisResult, EDiagBase, TAhkSymbolList } from '../globalEnum';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';
import { diagDAFile } from '../tools/DeepAnalysis/Diag/diagDA';

const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
function showOutputChannel(need: DeepAnalysisResult[], t1: number): void {
    let argMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    need.forEach((ed) => {
        argMapSize += ed.argMap.size;
        valMapSize += ed.valMap.size;
        textMapSize += ed.textMap.size;
    });

    OutputChannel.clear();
    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${need.length} Symbol`);
    OutputChannel.appendLine(`argMapSize is ${argMapSize}`);
    OutputChannel.appendLine(`valMapSize is ${valMapSize}`);
    OutputChannel.appendLine(`textMapSize is ${textMapSize}`);
    OutputChannel.appendLine(`All Size is ${argMapSize + valMapSize + textMapSize}`);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();
}

export async function DeepAnalysisAllFiles(): Promise<null> {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile(); // FIX

    const need: DeepAnalysisResult[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;

        const Uri = vscode.Uri.file(fsPath);
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(Uri);
        for (const ahkSymbol of AhkSymbolList) {
            const ed: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
            if (ed !== null) need.push(ed);
        }
        const diagnostics = diagDAFile(AhkSymbolList, document);
        const baseDiag = (diagColl.get(Uri) || []).filter((v) => v.source !== EDiagBase.sourceDA);
        diagColl.set(Uri, [
            ...baseDiag,
            ...diagnostics,
        ]);
    }

    showOutputChannel(need, t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 809 Symbol <--keep 809!
argMapSize is 2231 <--keep 2231!
valMapSize is 2050
textMapSize is 2921 <- next plan: ignore keyWord.
All Size is 7202
Done in 370~430 ms
*/
