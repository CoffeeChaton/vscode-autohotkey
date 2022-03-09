/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as vscode from 'vscode';
import { showTimeSpend } from '../configUI';
import {
    EDiagBase,
    EStr,
    TAhkSymbolList,
} from '../globalEnum';
import { baseDiagnostic } from '../provider/Diagnostic/Diagnostic';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { diagDAFile } from '../tools/DeepAnalysis/Diag/diagDA';
import { getBaseData } from './BaseScanCache/cache';
import { diagColl } from './diagRoot';
import { globalValMap } from './Global';

export const Detecter = {
    // key : vscode.Uri.fsPath,
    // val : vscode.DocumentSymbol[] -> MyDocSymbolArr
    DocMap: new Map<string, TAhkSymbolList>(),

    getDocMapFile(): IterableIterator<string> {
        return Detecter.DocMap.keys();
    },

    getDocMap(fsPath: string): null | TAhkSymbolList {
        //  const Uri = vscode.Uri.file(fsPath);
        return Detecter.DocMap.get(fsPath) ?? null;
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const Uri of e.files) {
            const { fsPath } = Uri;
            if (fsPath.endsWith('.ahk')) {
                Detecter.DocMap.delete(fsPath);
            }
            diagColl.delete(Uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const Uri of e.files) {
            const { fsPath } = Uri;
            if (fsPath.endsWith('.ahk')) {
                void Detecter.updateDocDef(false, fsPath, true);
            }
        }
    },

    renameFileName(e: vscode.FileRenameEvent): void {
        for (const { oldUri, newUri } of e.files) {
            if (oldUri.fsPath.endsWith('.ahk')) {
                Detecter.DocMap.delete(oldUri.fsPath);
                diagColl.delete(oldUri);
                if (newUri.fsPath.endsWith('.ahk')) {
                    void Detecter.updateDocDef(false, newUri.fsPath, true);
                    const fsPathList = Detecter.getDocMapFile();
                    void renameFileNameFunc(oldUri, newUri, [...fsPathList]);
                } // else EXP : let a.ahk -> a.ahk0 or a.0ahk
            }
        }
    },

    async updateDocDef(showMsg: boolean, fsPath: string, useDeepAnalysis: boolean): Promise<vscode.DocumentSymbol[]> {
        const Uri: vscode.Uri = vscode.Uri.file(fsPath);
        globalValMap.delete(fsPath);
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(Uri);
        const timeStart: number = Date.now();
        const {
            gValMapBySelf,
            DocStrMap,
            AhkSymbolList,
        } = getBaseData(document);

        if (!fsPath.includes(EStr.diff_name_prefix)) {
            if (showMsg) showTimeSpend(fsPath, timeStart);
            Detecter.DocMap.set(fsPath, AhkSymbolList);
            globalValMap.set(fsPath, gValMapBySelf);
            const baseDiag = baseDiagnostic(DocStrMap, AhkSymbolList);
            diagColl.set(Uri, [...baseDiag]);
            if (useDeepAnalysis) {
                const diagnostics = diagDAFile(AhkSymbolList, document);
                const otherDiag = (diagColl.get(Uri) || []).filter((v) => v.source !== EDiagBase.sourceDA);
                diagColl.set(Uri, [...otherDiag, ...diagnostics]);
            }
        }
        return AhkSymbolList as vscode.DocumentSymbol[];
    },
};
