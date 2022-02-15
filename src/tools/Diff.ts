/* eslint-disable security/detect-non-literal-fs-filename */
import * as path from 'path';
import * as temp from 'temp';
import * as vscode from 'vscode';
import { EStr } from '../globalEnum';

export type DiffType = {
    leftText: string;
    rightUri: vscode.Uri;
};

export async function callDiff({ leftText, rightUri }: DiffType): Promise<void> {
    temp.track();
    const affixes: temp.AffixOptions = {
        prefix: EStr.diff_name_prefix,
        suffix: '.ahk',
        // dir?: string,
    };
    const left = temp.createWriteStream(affixes);

    if (typeof left.path !== 'string') return;

    left.write(leftText);

    const title = `${path.basename(rightUri.fsPath)} -> after Format`;
    const options: vscode.TextDocumentShowOptions = {
        //   viewColumn: ViewColumn,
        preserveFocus: true,
        //  preview: true,
        // selection: Range,
    };

    await vscode.commands.executeCommand(
        'vscode.diff',
        vscode.Uri.file(left.path),
        rightUri,
        title,
        options,
    );

    left.end();
}
