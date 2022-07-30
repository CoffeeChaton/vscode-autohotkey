/* eslint no-magic-numbers: ["error", { "ignore": [1,2,3,4,5,6,7,8] }] */

import * as vscode from 'vscode';
import { EFormatChannel } from '../globalEnum';
import { FormatCore } from '../provider/Format/FormatProvider';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { getUriList } from '../tools/fsTools/getUriList';
import type { TPick } from './TPick';
import { UpdateCacheAsync } from './UpdateCache';

async function formatByPathAsync(
    uri: vscode.Uri,
    options: vscode.FormattingOptions,
): Promise<void> {
    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);

    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    WorkspaceEdit.set(
        uri,
        FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: EFormatChannel.byFormatAllFile,
            needDiff: true,
        }),
    );
    await vscode.workspace.applyEdit(WorkspaceEdit);
}

async function setFormattingOptions(): Promise<vscode.FormattingOptions | null> {
    const TabOrSpacePick: TPick<boolean> | undefined = await vscode.window.showQuickPick<TPick<boolean>>(
        [
            { label: '1 -> indent Using Tabs', fn: () => false },
            { label: '2 -> indent Using Spaces', fn: () => true },
        ],
        {
            title: 'Select Formatting Options',
        },
    );

    if (TabOrSpacePick === undefined) return null;

    const TabOrSpace: boolean = await TabOrSpacePick.fn();
    if (!TabOrSpace) { // Tab
        return {
            tabSize: 0,
            insertSpaces: false,
        };
    }

    type T1to8 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    type TTabSize = TPick<T1to8>;
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
    const tabSizePick: TTabSize | undefined = await vscode.window.showQuickPick<TTabSize>(items, {
        title: 'set format ident size',
    });
    if (tabSizePick === undefined) return null;
    const tabSize: T1to8 = await tabSizePick.fn();

    return {
        tabSize,
        insertSpaces: true,
    };
}

export async function FormatAllFile(): Promise<null> {
    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const fmtOpt: vscode.FormattingOptions | null = await setFormattingOptions();
    if (fmtOpt === null) return null;

    const t1: number = Date.now();
    const results: Promise<void>[] = [];
    for (const uri of uriList) {
        results.push(formatByPathAsync(uri, fmtOpt));
    }
    await Promise.all(results);
    const t2: number = Date.now();

    OutputChannel.appendLine('-----------------------------------------------');
    OutputChannel.appendLine(`FormatAllFile -> ${t2 - t1} ms`);
    OutputChannel.show();

    await UpdateCacheAsync(false);
    const t3: number = Date.now();
    OutputChannel.appendLine(`UpdateCacheAsync -> ${t3 - t2} ms`);
    OutputChannel.appendLine('-----------------------------------------------');
    OutputChannel.show();
    return null;
}
