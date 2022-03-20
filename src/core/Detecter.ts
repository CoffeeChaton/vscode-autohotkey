/* eslint-disable no-await-in-loop */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { showTimeSpend } from '../configUI';
import {
    EStr,
    TAhkSymbolList,
} from '../globalEnum';
import { baseDiagnostic } from '../provider/Diagnostic/Diagnostic';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { BaseScanCache, getBaseData } from './BaseScanCache/cache';
import { diagColl } from './diagRoot';
import { globalValMap } from './Global';

export type TUpdateDocDefReturn = {
    AhkSymbolList: TAhkSymbolList;
    document: vscode.TextDocument;
    t0: number;
    t1: number;
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
        for (const Uri of e.files) {
            const { fsPath } = Uri;
            if (fsPath.endsWith('.ahk')) {
                void Detecter.updateDocDef(false, fsPath);
            }
        }
    },

    renameFileName(e: vscode.FileRenameEvent): void {
        for (const { oldUri, newUri } of e.files) {
            if (oldUri.fsPath.endsWith('.ahk')) {
                delOldCache(oldUri);
                if (newUri.fsPath.endsWith('.ahk')) {
                    void Detecter.updateDocDef(false, newUri.fsPath);
                    const fsPathList = Detecter.getDocMapFile();
                    void renameFileNameFunc(oldUri, newUri, [...fsPathList]);
                } // else EXP : let a.ahk -> a.ahk0 or a.0ahk
            }
        }
    },

    async updateDocDef(showMsg: boolean, fsPath: string): Promise<TUpdateDocDefReturn> {
        const Uri: vscode.Uri = vscode.Uri.file(fsPath);
        globalValMap.delete(fsPath);
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(Uri);
        const t0: number = Date.now();
        const {
            gValMapBySelf,
            DocStrMap,
            AhkSymbolList,
        } = getBaseData(document);

        const t1: number = Date.now();
        if (!fsPath.includes(EStr.diff_name_prefix)) {
            if (showMsg) showTimeSpend(fsPath, t1 - t0); // just base scan // TODO config
            Detecter.DocMap.set(fsPath, AhkSymbolList);
            globalValMap.set(fsPath, gValMapBySelf);
            const baseDiag: vscode.Diagnostic[] = baseDiagnostic(DocStrMap, AhkSymbolList);
            diagColl.set(Uri, [...baseDiag]);
            // if (showMsg) showTimeSpend(fsPath, timeStart); // base scan + baseDiag
        }

        return {
            AhkSymbolList,
            document,
            t0,
            t1,
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
