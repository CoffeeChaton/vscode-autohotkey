/* eslint-disable security/detect-non-literal-fs-filename */
import * as temp from 'temp';
import * as vscode from 'vscode';
import { EStr } from '../globalEnum';

export type DiffType = {
    leftText: string;
    rightText: string;
    fileName: string; // path.basename(vscode.Uri.fsPath)
};

export async function callDiff({ leftText, rightText, fileName: basename }: DiffType): Promise<void> {
    temp.track();
    const affixes: temp.AffixOptions = {
        prefix: EStr.diff_name_prefix,
        suffix: '.ahk',
        // dir?: string,
    };
    const left = temp.createWriteStream(affixes);
    const right = temp.createWriteStream(affixes);

    if (typeof left.path !== 'string' || typeof right.path !== 'string') return;

    left.write(leftText);
    right.write(rightText);

    const title = `${basename} -> after Format`;

    const options: vscode.TextDocumentShowOptions = {
        // viewColumn: true,
        preserveFocus: true,
        //  preview: true,
        // selection: Range,
    };

    await vscode.commands.executeCommand(
        'vscode.diff',
        vscode.Uri.file(left.path),
        vscode.Uri.file(right.path),
        title,
        options,
    );

    left.end();
    right.end();
}
