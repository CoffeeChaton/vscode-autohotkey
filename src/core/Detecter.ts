/* eslint-disable max-lines-per-function */
import * as path from 'node:path';
import * as vscode from 'vscode';
import { ECommand } from '../command/ECommand';
import { showTimeSpend } from '../configUI';
import type { TFsPath } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import type { TMemo } from './BaseScanMemo/memo';
import { BaseScanMemo, getBaseData } from './BaseScanMemo/memo';

export type TAhkFileData = TMemo;

export const diagColl: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('ahk-neko-help');

// ProjectManager
export const Detecter = {
    // key : vscode.Uri.fsPath,
    DocMap: new Map<TFsPath, TAhkFileData>(),

    getDocMapValue(): TAhkFileData[] {
        const need: TAhkFileData[] = [...Detecter.DocMap.values()];
        // eslint-disable-next-line no-magic-numbers
        if (Math.random() > 0.3) { // 1/3 -> .reverse() exp, funcName double def at 2 files
            need.reverse();
        }
        // TODO check fs.existsSync(fsPath), but not this way.
        // Detecter.DocMap.delete(fsPath);
        // await openTextDocument(fsPath);
        return need;
    },

    getDocMap(fsPath: string): TAhkFileData | undefined {
        return Detecter.DocMap.get(fsPath);
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const uri of e.files) {
            delOldCache(uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const uri of e.files) {
            if (uri.fsPath.endsWith('.ahk')) {
                void vscode.workspace
                    .openTextDocument(uri)
                    .then((doc: vscode.TextDocument): TAhkFileData => Detecter.updateDocDef(doc));
            }
        }
    },

    async renameFileName(e: vscode.FileRenameEvent): Promise<void> {
        const docList0: Thenable<vscode.TextDocument>[] = renameFileNameBefore(e);
        for (const doc of await Promise.all(docList0)) Detecter.updateDocDef(doc);

        await vscode.commands.executeCommand(ECommand.ListAllInclude);

        const eventMsg: string[] = e.files
            .filter(({ oldUri, newUri }): boolean => oldUri.fsPath.endsWith('.ahk') || newUri.fsPath.endsWith('.ahk'))
            .map(({ oldUri, newUri }): string => `    ${oldUri.fsPath} \n -> ${newUri.fsPath}`);

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
        const UpDateDocDefReturn: TAhkFileData = getBaseData(document);

        const { uri } = document;
        const { fsPath, scheme } = uri;
        if (
            scheme === 'file'
            && !fsPath.startsWith('\\')
            && fsPath.endsWith('.ahk')
        ) {
            Detecter.DocMap.set(fsPath, UpDateDocDefReturn);
            diagColl.set(uri, [...UpDateDocDefReturn.baseDiag]);
        }

        const fileName: string = path.basename(fsPath);
        showTimeSpend(fileName);

        return UpDateDocDefReturn;
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    Detecter.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    diagColl.delete(uri);
}

function renameFileNameBefore(e: vscode.FileRenameEvent): Thenable<vscode.TextDocument>[] {
    const docList0: Thenable<vscode.TextDocument>[] = [];
    for (const { oldUri, newUri } of e.files) {
        if (oldUri.fsPath.endsWith('.ahk')) {
            delOldCache(oldUri); // ...not't open old .ahk
        }
        if (newUri.fsPath.endsWith('.ahk')) {
            docList0.push(vscode.workspace.openTextDocument(newUri));
        }
    }
    return docList0;
}
