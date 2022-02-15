import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';

export async function DeepAnalysisAllFiles(): Promise<null> {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | null = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) continue;

        const Uri = vscode.Uri.file(fsPath);
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(Uri);
        for (const ahkSymbol of AhkSymbolList) {
            DeepAnalysis(document, ahkSymbol);
        }
    }
    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}
