import * as vscode from 'vscode';
import { EDiagBase } from '../../globalEnum';
import { diagColl } from './diagRoot';

function clearNekoDA(uri: vscode.Uri): null {
    const diagS: readonly vscode.Diagnostic[] | undefined = diagColl.get(uri);
    if (diagS === undefined) return null;
    const diagNewList: vscode.Diagnostic[] = diagS.filter(
        (diag: vscode.Diagnostic) => diag.source === EDiagBase.source,
    );
    // for (const diag of diagS) {
    //     if (diag.source === EDiagBase.source) {
    //         diagNewList.push(diag);
    //     }
    // }
    diagColl.delete(uri);
    diagColl.set(uri, diagNewList);
    return null;
}

export function onClosetDocClearDiag(fsPath: string): void {
    const uri = vscode.Uri.file(fsPath);

    if (uri.fsPath.endsWith('.ahk')) {
        clearNekoDA(uri);
    }

    if (uri.fsPath.endsWith('.ahk.git')) {
        clearNekoDA(uri);

        const uriWithOutGit = vscode.Uri.file(fsPath.replace(/\.ahk\.git$/ui, '.ahk'));
        clearNekoDA(uriWithOutGit);
    }
}
