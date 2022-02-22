/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { getIgnoredFile, getIgnoredFolder, showTimeSpend } from '../configUI';
import {
    EStr,
    TAhkSymbolList,
    TGlobalVal,
    TGValMap,
    TValUpName,
} from '../globalEnum';
import { nekoDiagnostic } from '../provider/Diagnostic/Diagnostic';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';
import { Pretreatment } from '../tools/Pretreatment';
import { diagColl } from './diagColl';
import { getChildren } from './getChildren';
import { globalValMap } from './globalValMap';
import { getReturnByLine, ParserBlock } from './Parser';
import { ParserLine } from './ParserLine';
import { renameFn as renameFileNameFunc } from './renameFileNameFunc';

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
            if (oldUri.fsPath.endsWith('.ahk') && newUri.fsPath.endsWith('.ahk')) {
                Detecter.DocMap.delete(oldUri.fsPath);
                diagColl.delete(oldUri);
                void Detecter.updateDocDef(false, newUri.fsPath, true);
                const fsPathList = Detecter.getDocMapFile();
                void renameFileNameFunc(oldUri, newUri, [...fsPathList]);
            }
        }
    },

    async updateDocDef(showMsg: boolean, fsPath: string, useDeepAnalysis: boolean): Promise<vscode.DocumentSymbol[]> {
        const Uri = vscode.Uri.file(fsPath);
        globalValMap.delete(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        const gValMapBySelf: TGValMap = new Map<TValUpName, TGlobalVal[]>();

        const DocStrMap = Pretreatment(document.getText().split('\n'), 0);
        const result = getChildren({
            gValMapBySelf,
            Uri,
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            inClass: false,
            fnList: [
                ParserBlock.getClass,
                ParserBlock.getFunc,
                ParserBlock.getComment,
                ParserBlock.getSwitchBlock,
                getReturnByLine,
                ParserLine,
            ],
        });

        if (!fsPath.includes(EStr.diff_name_prefix)) {
            if (showMsg) showTimeSpend(document.uri, timeStart);
            Detecter.DocMap.set(fsPath, result);
            globalValMap.set(fsPath, gValMapBySelf);
            nekoDiagnostic(DocStrMap, result, Uri, diagColl);
            if (useDeepAnalysis) {
                for (const ahkSymbol of result) {
                    DeepAnalysis(document, ahkSymbol);
                }
            }
        }
        return result as vscode.DocumentSymbol[];
    },
};

export async function buildByPathAsync(showMsg: boolean, buildPath: string, useDeepAnalysis: boolean): Promise<void> {
    if (fs.statSync(buildPath).isDirectory()) {
        const files = fs.readdirSync(buildPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                await buildByPathAsync(showMsg, `${buildPath}/${file}`, useDeepAnalysis);
            }
        }
    } else if (!getIgnoredFile(buildPath)) {
        // const Uri = vscode.Uri.file(buildPath);
        await Detecter.updateDocDef(showMsg, vscode.Uri.file(buildPath).fsPath, useDeepAnalysis);
    }
}

export function buildByPath(buildPath: string, useDeepAnalysis: boolean): void {
    if (fs.statSync(buildPath).isDirectory()) {
        const files = fs.readdirSync(buildPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                buildByPath(`${buildPath}/${file}`, useDeepAnalysis);
            }
        }
    } else if (!getIgnoredFile(buildPath)) {
        // const Uri = vscode.Uri.file(buildPath);
        void Detecter.updateDocDef(false, vscode.Uri.file(buildPath).fsPath, useDeepAnalysis);
    }
}
