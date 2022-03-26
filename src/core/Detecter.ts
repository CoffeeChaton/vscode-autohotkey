/* eslint-disable no-await-in-loop */
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    EStr,
    TAhkSymbolList,
    TTokenStream,
} from '../globalEnum';
import { baseDiagnostic } from '../provider/Diagnostic/Diagnostic';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { BaseScanCache, getBaseData } from './BaseScanCache/cache';
import { diagColl } from './diagRoot';
import { globalValMap } from './Global';

export type TUpdateDocDefReturn = {
    AhkSymbolList: TAhkSymbolList;
    DocStrMap: TTokenStream;
    t0: number;
    t1: number;
    t2: number;
};

export const Detecter = {
    // key : vscode.Uri.fsPath,
    // val : vscode.DocumentSymbol[] -> MyDocSymbolArr
    DocMap: new Map<string, TAhkSymbolList>(),

    getDocMapFile(): string[] {
        // FIXME: check file exit / or change
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

    getDocMap(fsPath: string): undefined | TAhkSymbolList {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        return fs.existsSync(fsPath)
            ? Detecter.DocMap.get(fsPath)
            : undefined;
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
                    .then((doc: vscode.TextDocument): TUpdateDocDefReturn => Detecter.updateDocDef(doc));
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
                        .then((doc: vscode.TextDocument): TUpdateDocDefReturn => Detecter.updateDocDef(doc));
                    await renameFileNameFunc(oldUri, newUri);
                } // else EXP : let a.ahk -> a.ahk0 or a.0ahk
            }
        }
    },

    // document: vscode.TextDocument
    updateDocDef(document: vscode.TextDocument): TUpdateDocDefReturn {
        const t0: number = Date.now();
        const { uri } = document;
        const { fsPath } = document.uri;
        globalValMap.delete(fsPath);
        // const document: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);

        const t1: number = Date.now();
        const {
            gValMapBySelf,
            DocStrMap,
            AhkSymbolList,
        } = getBaseData(document);

        const t2: number = Date.now();
        if (fsPath.endsWith('.ahk') && !fsPath.includes(EStr.diff_name_prefix)) {
            Detecter.DocMap.set(fsPath, AhkSymbolList);
            globalValMap.set(fsPath, gValMapBySelf);
            const baseDiag: vscode.Diagnostic[] = baseDiagnostic(DocStrMap, AhkSymbolList);
            diagColl.set(uri, [...baseDiag]);
        }

        return {
            AhkSymbolList,
            DocStrMap,
            t0,
            t1,
            t2,
        };
    },
};

export function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    Detecter.DocMap.delete(fsPath);
    BaseScanCache.cache.delete(fsPath);
    globalValMap.delete(fsPath);
    diagColl.delete(uri);
}
