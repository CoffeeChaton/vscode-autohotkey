/* eslint-disable no-await-in-loop */
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    EStr,
    TAhkSymbolList,
    TGValMap,
    TTokenStream,
} from '../globalEnum';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { BaseScanMemo, getBaseData } from './BaseScanMemo/memo';

export const diagColl: vscode.DiagnosticCollection = vscode.languages.createDiagnosticCollection('ahk-neko-help');

export type TAhkFileData = {
    AhkSymbolList: TAhkSymbolList;
    DocStrMap: TTokenStream;
    GValMap: TGValMap;
    t0: number;
    t1: number;
    t2: number;
};

export const Detecter = {
    // key : vscode.Uri.fsPath,
    // val : vscode.DocumentSymbol[] -> MyDocSymbolArr
    DocMap: new Map<string, TAhkFileData>(),

    getDocMapFile(): string[] {
        const need: string[] = [];
        const keyList: string[] = [...Detecter.DocMap.keys()];
        for (const fsPath of keyList) {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (fs.existsSync(fsPath)) {
                need.push(fsPath);
            } else {
                Detecter.DocMap.delete(fsPath);
            }
        }
        return need;
    },

    getDocMap(fsPath: string): undefined | TAhkFileData {
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
        for (const { oldUri, newUri } of e.files) {
            if (oldUri.fsPath.endsWith('.ahk')) {
                delOldCache(oldUri);
                if (newUri.fsPath.endsWith('.ahk')) {
                    await vscode.workspace
                        .openTextDocument(newUri)
                        .then((doc: vscode.TextDocument): TAhkFileData => Detecter.updateDocDef(doc));
                    await renameFileNameFunc(oldUri, newUri);
                } // else EXP : let a.ahk -> a.ahk0 or a.0ahk
            }
        }
    },

    updateDocDef(document: vscode.TextDocument): TAhkFileData {
        const t0: number = Date.now();
        const { uri } = document;
        const { fsPath } = document.uri;

        const t1: number = Date.now();
        const {
            GValMap,
            DocStrMap,
            AhkSymbolList,
            baseDiag,
        } = getBaseData(document);

        const t2: number = Date.now();
        const UpDateDocDefReturn: TAhkFileData = {
            AhkSymbolList,
            DocStrMap,
            GValMap,
            t0,
            t1,
            t2,
        };
        if (fsPath.endsWith('.ahk') && !fsPath.includes(EStr.diff_name_prefix)) {
            Detecter.DocMap.set(fsPath, UpDateDocDefReturn);
            diagColl.set(uri, [...baseDiag]);
        }

        return UpDateDocDefReturn;
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    Detecter.DocMap.delete(fsPath);
    BaseScanMemo.memo.delete(fsPath);
    diagColl.delete(uri);
}
