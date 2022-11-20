/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { ECommand } from '../command/ECommand';
import type { TFsPath } from '../globalEnum';
import { setBaseDiag } from '../provider/Diagnostic/setBaseDiag';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { isAhk } from '../tools/fsTools/isAhk';
import { rmFileDiag } from './diagColl';
import type { TMemo } from './ParserTools/getFileAST';
import { BaseScanMemo, getFileAST } from './ParserTools/getFileAST';

export type TAhkFileData = TMemo;

/**
 * ProjectManager
 */
export const pm = {
    // key : vscode.Uri.fsPath,
    DocMap: new Map<TFsPath, TAhkFileData>(),

    /**
     * ```js
     * 1/3 -> .reverse()
     * ```
     * @exp, funcName double def at 2 files
     */
    getDocMapValue(): TAhkFileData[] {
        const need: TAhkFileData[] = [...pm.DocMap.values()];
        // eslint-disable-next-line no-magic-numbers
        if (Math.random() > 0.3) {
            need.reverse();
        }
        return need;
    },

    getDocMap(fsPath: string): TAhkFileData | undefined {
        return pm.DocMap.get(fsPath);
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const uri of e.files) {
            delOldCache(uri);
            rmFileDiag(uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const uri of e.files) {
            if (isAhk(uri.fsPath)) {
                void vscode.workspace
                    .openTextDocument(uri)
                    .then((doc: vscode.TextDocument): TAhkFileData => pm.updateDocDef(doc));
            }
        }
    },

    async renameFiles(e: vscode.FileRenameEvent): Promise<void> {
        const eventMsg: string[] = e.files
            .filter(({ oldUri, newUri }): boolean => isAhk(oldUri.fsPath) || isAhk(newUri.fsPath))
            .map(({ oldUri, newUri }): string => `    ${oldUri.fsPath} \n -> ${newUri.fsPath}`);

        if (eventMsg.length === 0) return;

        const docList0: Thenable<vscode.TextDocument>[] = renameFileNameBefore(e);
        for (const doc of await Promise.all(docList0)) pm.updateDocDef(doc);

        await vscode.commands.executeCommand(ECommand.ListAllInclude);

        OutputChannel.appendLine([
            '',
            '----------------------',
            '',
            '[neko-help] FileRenameEvent',
            ...eventMsg,
            '',
            '> please check #Include',
        ].join('\n'));
        OutputChannel.show();
    },

    updateDocDef(document: vscode.TextDocument): TAhkFileData {
        const UpDateDocDefReturn: TAhkFileData = getFileAST(document);

        const { uri } = document;
        const { fsPath, scheme } = uri;
        if (
            scheme === 'file'
            && !fsPath.startsWith('\\')
            && isAhk(fsPath)
        ) {
            pm.DocMap.set(fsPath, UpDateDocDefReturn);
            const { AST, DocStrMap } = UpDateDocDefReturn;
            setBaseDiag(uri, DocStrMap, AST);
        }

        return UpDateDocDefReturn;
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    pm.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    rmFileDiag(uri);
}

function renameFileNameBefore(e: vscode.FileRenameEvent): Thenable<vscode.TextDocument>[] {
    const docList0: Thenable<vscode.TextDocument>[] = [];
    for (const { oldUri, newUri } of e.files) {
        if (isAhk(oldUri.fsPath)) {
            delOldCache(oldUri); // ...not't open old .ahk
        }
        if (isAhk(newUri.fsPath)) {
            docList0.push(vscode.workspace.openTextDocument(newUri));
        }
    }
    return docList0;
}
