/* eslint-disable security/detect-non-literal-fs-filename */
import * as vscode from 'vscode';
import * as temp from 'temp';
import { EStr } from '../globalEnum';
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type DiffType = {
    leftText: string,
    rightTxt: string,
    fsPath: string
};

export async function callDiff({
    leftText, rightTxt, fsPath,
}: DiffType): Promise<void> {
    // const {
    //     leftText, rightTxt, fsPath,
    // } = Diff;

    temp.track();
    const affixes: temp.AffixOptions = {
        prefix: EStr.diff_name_prefix,
        suffix: '.ahk',
        // dir?: string,
    };

    const left = temp.createWriteStream(affixes);
    const right = temp.createWriteStream(affixes);

    if (typeof left.path !== 'string' || typeof right.path !== 'string') return;
    //   const decoration = (text: string): string => `;start line ${startLine + 1}\n\n${text}\n\n;end line ${endLine + 1}`;
    left.write(leftText);
    right.write(rightTxt);

    const title = `${fsPath.substring(fsPath.lastIndexOf('/') + 1)} -> after Format`;
    const options: vscode.TextDocumentShowOptions = {
        //   viewColumn: ViewColumn,
        preserveFocus: true,
        //  preview: true,
        // selection: Range,
    };
    await vscode.commands.executeCommand('vscode.diff',
        vscode.Uri.file(left.path),
        vscode.Uri.file(right.path),
        title,
        options);

    right.end();
    left.end();
}
