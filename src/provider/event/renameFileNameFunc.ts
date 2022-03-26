/* eslint-disable no-await-in-loop */
import * as path from 'path';
import * as vscode from 'vscode';
import { TTokenStream } from '../../globalEnum';
import { getUriList } from '../../tools/fsTools/getUriList';
import { Pretreatment } from '../../tools/Pretreatment';

export async function renameFileNameFunc(oldUri: vscode.Uri, newUri: vscode.Uri): Promise<void> {
    const UriList = getUriList();
    if (UriList === null) {
        return;
    }

    const oldFileName = path.basename(oldUri.fsPath, '.ahk');
    const newFileName = path.basename(newUri.fsPath, '.ahk');
    const RegexInclude = /^\s*#Include(?:Again)?\s+/ui;
    const edit = new vscode.WorkspaceEdit();
    const editUriList: vscode.Uri[] = [];

    for (const uri of UriList) {
        const document = await vscode.workspace.openTextDocument(uri);
        const DocStrMap: TTokenStream = Pretreatment(document.getText().split('\n'), 0);
        const lineCount = DocStrMap.length;
        for (let line = 0; line < lineCount; line++) {
            const { textRaw, lStr } = DocStrMap[line];
            if (
                RegexInclude.test(lStr)
                && textRaw.includes(oldFileName)
            ) {
                const Remarks = `\n;;${oldFileName} -> ${newFileName} ; at ${new Date().toLocaleString()}`;
                const newText = textRaw.replace(oldFileName, newFileName) + Remarks;
                const newPos = new vscode.Position(line, 0);
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
