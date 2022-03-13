/* eslint no-magic-numbers: ["error", { "ignore": [1,2,3,4,5,6,7,8] }] */

import * as vscode from 'vscode';
import { TFormatChannel, TPick } from '../globalEnum';
import { FormatCore } from '../provider/Format/FormatProvider';
import { getUriList } from '../tools/fsTools/getUriList';

async function formatByPathAsync(
    uri: vscode.Uri,
    options: vscode.FormattingOptions,
    jestTest: boolean,
): Promise<void> {
    const document = await vscode.workspace.openTextDocument(uri);

    const edits: vscode.TextEdit[] | null | undefined = await FormatCore({
        document,
        options,
        fmtStart: 0,
        fmtEnd: document.lineCount - 1,
        from: TFormatChannel.byFormatAllFile,
        needDiff: true,
    });
    if (!jestTest && edits) {
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        edit.set(uri, edits);
        await vscode.workspace.applyEdit(edit);
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

async function getJustTest(): Promise<boolean | null> {
    type TJustTest = TPick<boolean>;
    const items: TJustTest[] = [
        { label: '1 -> just test format replace func <---bug now', fn: () => true },
        { label: '2 -> need format all', fn: () => false },
    ];
    const jestTestPick = await vscode.window.showQuickPick<TJustTest>(items, {
        title: 'this is Dev tools',
    });

    const jestTest = await jestTestPick?.fn();
    if (jestTest === undefined) return null;

    return jestTest;
}

export async function FormatAllFile(): Promise<null> {
    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const jestTest = await getJustTest();
    if (jestTest === null) return null;

    const options: vscode.FormattingOptions | null = await setFormattingOptions();
    if (options === null) return null;

    const timeStart = Date.now();
    const results: Promise<void>[] = [];
    for (const uri of uriList) {
        results.push(formatByPathAsync(uri, options, jestTest));
    }
    await Promise.all(results);

    void vscode.window.showInformationMessage(`FormatAllFile ${Date.now() - timeStart}ms`);
    return null;
}
