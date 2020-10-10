/* eslint-disable security/detect-object-injection */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { getFileName } from '../tools/getFileName';
import { Pretreatment } from '../tools/Pretreatment';

export async function renameFn(oldUri: vscode.Uri, newUri: vscode.Uri, fsPathList: string[]): Promise<void> {
    const oldFileName = getFileName(oldUri.fsPath);
    const newFileName = getFileName(newUri.fsPath);
    const RegexInclude = /^\s*#Include(?:Again)?\s\s*/i;
    const edit = new vscode.WorkspaceEdit();
    const uriList: vscode.Uri[] = [];
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const DocStrMap = Pretreatment(document.getText().split('\n'));
        const lineCount = DocStrMap.length;
        for (let line = 0; line < lineCount; line += 1) {
            // eslint-disable-next-line prefer-destructuring
            const textRaw = DocStrMap[line].textRaw;
            if (RegexInclude.test(textRaw)
                && textRaw.includes(oldFileName)) { // TODO TEST
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
