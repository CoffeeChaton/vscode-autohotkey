import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { DeepAnalysisResult, TAhkSymbolList } from '../globalEnum';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';

export async function DeepAnalysisAllFiles(): Promise<null> {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    let size = 0;

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
            size += ed.argMap.size;
            size += ed.valMap.size;
            size += ed.textMap.size;
        }
    }

    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${need.length} Symbol`);
    OutputChannel.appendLine(`All Size is ${size}`);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

/*
my project:

// not weakMap
Deep Analysis All Files
Deep Analysis : 809 Symbol
All Size is 14238
Done in 748 ms

// ignoreSet textMap
Deep Analysis All Files
Deep Analysis : 809 Symbol
All Size is 10362
Done in 539 ms

// ignoreSet textMap (/^_{3,}/ui).test(wordUp)
Deep Analysis All Files
Deep Analysis : 809 Symbol
All Size is 7821
Done in 515 ms

*/
