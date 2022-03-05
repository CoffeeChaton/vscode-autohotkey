import * as vscode from 'vscode';
import { diagColl } from '../../core/diagRoot';
import { EDiagBase } from '../../globalEnum';

function clearNekoDA(uri: vscode.Uri): null {
    const diagS = diagColl.get(uri);
    if (diagS === undefined) return null;

    const diagNewList = diagS.filter((diag) => diag.source !== EDiagBase.sourceDA);
    // diagColl.delete(uri);
    diagColl.set(uri, diagNewList);
    return null;
}

export function onClosetDocClearDiag(fsPath: string): void {
    const uri = vscode.Uri.file(fsPath);
    if (uri.fsPath.endsWith('.ahk')) {
        clearNekoDA(uri);
    } else if (uri.fsPath.endsWith('.ahk.git')) {
        clearNekoDA(uri);
        const uriWithOutGit = vscode.Uri.file(fsPath.replace(/\.ahk\.git$/ui, '.ahk'));
        clearNekoDA(uriWithOutGit);
    }
}
