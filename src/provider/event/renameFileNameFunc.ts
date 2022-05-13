/* eslint-disable no-await-in-loop */
import * as path from 'path';
import * as vscode from 'vscode';
import { Pretreatment } from '../../core/Pretreatment';
import { TTokenStream } from '../../globalEnum';
import { getUriList } from '../../tools/fsTools/getUriList';

export async function renameFileNameFunc(oldUri: vscode.Uri, newUri: vscode.Uri): Promise<void> {
    const UriList: vscode.Uri[] | null = getUriList();
    if (UriList === null) {
        return;
    }

    const oldFileName: string = path.basename(oldUri.fsPath, '.ahk');
    const newFileName: string = path.basename(newUri.fsPath, '.ahk');
    const RegexInclude = /^\s*#Include(?:Again)?\s+/ui;
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    const editUriList: vscode.Uri[] = [];

    for (const uri of UriList) {
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);

        const DocStrMap: TTokenStream = Pretreatment(document.getText().split(/\r?\n/u), document.fileName);
        for (const { textRaw, lStr, line } of DocStrMap) {
            if (
                RegexInclude.test(lStr)
                && textRaw.includes(oldFileName)
            ) {
                const Remarks = `\n;;${oldFileName} -> ${newFileName} ; at ${new Date().toISOString()}`;
                const newText: string = textRaw.replace(oldFileName, newFileName) + Remarks;
                const newPos: vscode.Position = new vscode.Position(line, 0);
                edit.insert(uri, newPos, newText);
                editUriList.push(uri);
            }
        }
    }
    for (const editUri of editUriList) {
        void vscode.window.showTextDocument(editUri);
    }
    void vscode.workspace.applyEdit(edit);
}
