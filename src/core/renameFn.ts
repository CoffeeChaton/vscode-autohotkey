/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { getFileName } from '../tools/getFileName';
import { inCommentBlock } from '../tools/inCommentBlock';

export const renameFn = async (oldUri: vscode.Uri, newUri: vscode.Uri, fsPathList: string[]): Promise<void> => {
    const oldFileName = getFileName(oldUri.fsPath);
    const newFileName = getFileName(newUri.fsPath);
    const RegexInclude = /^\s*#Include(?:Again)?\s\s*/i;
    const edit = new vscode.WorkspaceEdit();
    const uriList: vscode.Uri[] = [];
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const lineCount = Math.min(document.lineCount, 10000);
        let CommentBlock = false;
        for (let line = 0; line < lineCount; line += 1) {
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            if (CommentBlock) continue;
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
};
