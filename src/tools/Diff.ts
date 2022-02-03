/* eslint-disable security/detect-non-literal-fs-filename */
import * as vscode from 'vscode';
import * as temp from 'temp';
import * as path from 'path';
import { EStr } from '../globalEnum';

export type DiffType = {
    leftText: string;
    right: string | vscode.Uri;
    fsPath: string;
};

export async function callDiff({
    leftText, right: rightInput, fsPath,
}: DiffType): Promise<void> {
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
    if (typeof rightInput === 'string') {
        right.write(rightInput);
    }
    const rightUri: vscode.Uri = typeof rightInput === 'string' ? vscode.Uri.file(right.path) : rightInput;

    const title = `${path.basename(fsPath)} -> after Format`;
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

    right.end();
    left.end();
}
