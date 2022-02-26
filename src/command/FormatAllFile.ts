/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint no-magic-numbers: ["error", { "ignore": [1,2,3,4,5,6,7,8] }] */

import * as fs from 'fs';
import * as vscode from 'vscode';
import { getIgnoredFile, getIgnoredFolder } from '../configUI';
import { TFormatChannel, TPick } from '../globalEnum';
import { FormatCore } from '../provider/Format/FormatProvider';
import { getWorkspaceFolders } from '../tools/getWorkspaceFolders';

async function formatByPathAsync(formatPath: string, options: vscode.FormattingOptions): Promise<void> {
    if (fs.statSync(formatPath).isDirectory()) {
        const files = fs.readdirSync(formatPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                await formatByPathAsync(`${formatPath}/${file}`, options);
            }
        }
    } else if (!getIgnoredFile(formatPath)) {
        const Uri = vscode.Uri.file(formatPath);
        const document = await vscode.workspace.openTextDocument(Uri);

        const edits: vscode.TextEdit[] | null | undefined = await FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: TFormatChannel.byFormatAllFile,
            needDiff: true,
        });
        if (edits) {
            const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
            edit.set(Uri, edits);
            await vscode.workspace.applyEdit(edit);
        }
    }
}

async function setFormattingOptions(): Promise<vscode.FormattingOptions | null> {
    type TUseTabOrSpace = TPick<boolean>;
    const selectTabOrSpace: TUseTabOrSpace[] = [
        { label: '1 -> indent Using Tabs', fn: () => false },
        { label: '2 -> indent Using Spaces', fn: () => true },
    ];

    const TabOrSpacePick = await vscode.window.showQuickPick<TUseTabOrSpace>(selectTabOrSpace, {
        title: 'Select Formatting Options',
    });

    const insertSpaces = await TabOrSpacePick?.fn();
    if (insertSpaces === undefined) return null;

    type TTabSize = TPick<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>;
    const items: TTabSize[] = [
        { label: '1', fn: () => 1 },
        { label: '2', fn: () => 2 },
        { label: '3', fn: () => 3 },
        { label: '4', fn: () => 4 },
        { label: '5', fn: () => 5 },
        { label: '6', fn: () => 6 },
        { label: '7', fn: () => 7 },
        { label: '8', fn: () => 8 },
    ];
    const tabSizePick = await vscode.window.showQuickPick<TTabSize>(items, {
        title: 'set format ident size',
    });

    const tabSize = await tabSizePick?.fn();
    if (tabSize === undefined) return null;

    return {
        tabSize,
        insertSpaces,
    };
}

export async function FormatAllFile(): Promise<null> {
    const ahkRootPath = getWorkspaceFolders();
    if (ahkRootPath === null) return null;

    const options: vscode.FormattingOptions | null = await setFormattingOptions();
    if (options === null) return null;

    const timeStart = Date.now();
    for (const folder of ahkRootPath) {
        await formatByPathAsync(folder.uri.fsPath, options);
    }
    void vscode.window.showInformationMessage(`FormatAllFile ${Date.now() - timeStart}ms`);
    return null;
}
