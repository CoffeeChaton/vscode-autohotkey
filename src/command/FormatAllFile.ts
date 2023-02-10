/* eslint no-magic-numbers: ["error", { "ignore": [1,2,3,4,5,6,7,8] }] */

import * as vscode from 'vscode';
import { EFormatChannel } from '../globalEnum';
import { FormatCore } from '../provider/Format/FormatProvider';
import { log } from '../provider/vscWindows/log';
import { getUriList } from '../tools/fsTools/getUriList';
import { showFileList } from '../tools/fsTools/showFileList';
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
    type TSelectTabOrSpace = {
        label: string,
        useTabs: boolean,
    };

    const TabOrSpacePick: TSelectTabOrSpace | undefined = await vscode.window.showQuickPick<TSelectTabOrSpace>([
        { label: '1 -> indent Using Tabs', useTabs: true },
        { label: '2 -> indent Using Spaces', useTabs: false },
    ], { title: 'Select Formatting Options' });

    if (TabOrSpacePick === undefined) return null;

    if (TabOrSpacePick.useTabs) { // Tab
        return {
            tabSize: 0,
            insertSpaces: false,
        };
    }

    type TSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    type TTabSize = {
        label: `${TSize}`,
        size: TSize,
    };

    const sizePick: TTabSize | undefined = await vscode.window.showQuickPick<TTabSize>([
        { label: '1', size: 1 },
        { label: '2', size: 2 },
        { label: '3', size: 3 },
        { label: '4', size: 4 },
        { label: '5', size: 5 },
        { label: '6', size: 6 },
        { label: '7', size: 7 },
        { label: '8', size: 8 },
    ], { title: 'set format ident size' });
    if (sizePick === undefined) return null;

    return {
        tabSize: sizePick.size,
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

    log.info(`FormatAllFile -> ${t2 - t1} ms\n${showFileList(uriList.map((uri: vscode.Uri): string => uri.fsPath))}`);
    log.show();

    await UpdateCacheAsync(false);
    return null;
}
