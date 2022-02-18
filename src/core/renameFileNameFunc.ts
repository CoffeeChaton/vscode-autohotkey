/* eslint-disable no-await-in-loop */
import * as path from 'path';
import * as vscode from 'vscode';
import { Pretreatment } from '../tools/Pretreatment';

export async function renameFn(oldUri: vscode.Uri, newUri: vscode.Uri, fsPathList: string[]): Promise<void> {
    const oldFileName = path.basename(oldUri.fsPath, '.ahk');
    const newFileName = path.basename(newUri.fsPath, '.ahk');
    const RegexInclude = /^\s*#Include(?:Again)?\s+/ui;
    const edit = new vscode.WorkspaceEdit();
    const uriList: vscode.Uri[] = [];
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const DocStrMap = Pretreatment(document.getText().split('\n'), 0);
        const lineCount = DocStrMap.length;
        for (let line = 0; line < lineCount; line++) {
            const { textRaw } = DocStrMap[line];
            if (
                RegexInclude.test(textRaw)
                && textRaw.includes(oldFileName)
            ) { // TODO TEST
                const Today = new Date();
                const Remarks = `\n;;${oldFileName} -> ${newFileName} ; at ${Today.toLocaleString()}`;
                const newText = textRaw.replace(oldFileName, newFileName) + Remarks;
                const newPos = new vscode.Position(line, 0);
                const uri = vscode.Uri.file(fsPath);
                edit.insert(uri, newPos, newText);
                uriList.push(uri);
            }
        }
    }
    for (const uri of uriList) {
        vscode.window.showTextDocument(uri);
    }
    vscode.workspace.applyEdit(edit);
}
