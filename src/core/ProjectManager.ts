/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { ECommand } from '../command/ECommand';
import type { TFsPath } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { isAhk } from '../tools/fsTools/isAhk';
import type { TMemo } from './BaseScanMemo/getFileAST';
import { BaseScanMemo, getFileAST } from './BaseScanMemo/getFileAST';

export type TAhkFileData = TMemo;

export const diagColl: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('ahk-neko-help');

/**
 * ProjectManager
 */
export const pm = {
    // key : vscode.Uri.fsPath,
    DocMap: new Map<TFsPath, TAhkFileData>(),

    getDocMapValue(): TAhkFileData[] {
        const need: TAhkFileData[] = [...pm.DocMap.values()];
        // eslint-disable-next-line no-magic-numbers
        if (Math.random() > 0.3) { // 1/3 -> .reverse() exp, funcName double def at 2 files
            need.reverse();
        }
        // TODO check fs.existsSync(fsPath), but not this way.
        // Detecter.DocMap.delete(fsPath);
        // await openTextDocument(fsPath);
        // https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-beta/#file-watching-changes
        return need;
    },

    getDocMap(fsPath: string): TAhkFileData | undefined {
        return pm.DocMap.get(fsPath);
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const uri of e.files) {
            delOldCache(uri);
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
            diagColl.set(uri, [...UpDateDocDefReturn.baseDiag]);
        }

        return UpDateDocDefReturn;
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    pm.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    diagColl.delete(uri);
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
