import * as vscode from 'vscode';
import { diagColl } from '../../core/Detecter';
import { EDiagBase } from '../../Enum/EDiagBase';

function clearNekoDA(uri: vscode.Uri): null {
    const isVisible: boolean = vscode.window.visibleTextEditors
        .some((editor: vscode.TextEditor): boolean => editor.document.uri.fsPath === uri.fsPath);

    if (isVisible) return null;

    const diagList: readonly vscode.Diagnostic[] | undefined = diagColl.get(uri);
    if (diagList === undefined) return null;

    const diagNewList: vscode.Diagnostic[] = [];
    for (const diag of diagList) {
        if (diag.source !== EDiagBase.sourceDA) {
            diagNewList.push(diag);
        }
    }

    diagColl.set(uri, diagNewList);
    return null;
}

function onClosetDocClearDiag(fsPath: string): void {
    const uri: vscode.Uri = vscode.Uri.file(fsPath);
    if (uri.fsPath.endsWith('.ahk')) {
        clearNekoDA(uri);
    } else if (uri.fsPath.endsWith('.ahk.git')) {
        clearNekoDA(uri);
        const uriWithOutGit: vscode.Uri = vscode.Uri.file(fsPath.replace(/\.ahk\.git$/ui, '.ahk'));
        clearNekoDA(uriWithOutGit);
    }
}

export function ahkOnDidCloseTextDoc(doc: vscode.TextDocument): void {
    void onClosetDocClearDiag(doc.uri.fsPath);
}
