/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { getChildren } from './getChildren';
import { ParserLine, ParserBlock, getReturnByLine } from './Parser';
import { getIgnoredFile, getIgnoredFolder, showTimeSpend } from '../configUI';
import {
    EStr, TAhkSymbolList, TGValMap, TValArray, TValName,
} from '../globalEnum';
import { renameFn as renameFileNameFunc } from './renameFileNameFunc';
import { Pretreatment } from '../tools/Pretreatment';
import { Diagnostic } from '../provider/Diagnostic/Diagnostic';

export const Detecter = {
    // key : vscode.Uri.fsPath,
    // val : vscode.DocumentSymbol[] -> MyDocSymbolArr
    DocMap: new Map<string, TAhkSymbolList>(),

    // diagColl : vscode.DiagnosticCollection
    diagColl: vscode.languages.createDiagnosticCollection('ahk-neko-help'),

    // key : vscode.Uri.fsPath,
    // val : Map<
    //          key: TValName
    //          val : TVal
    //          >
    globalValMap: new Map<string, TGValMap>(),

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
            Detecter.diagColl.delete(Uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const Uri of e.files) {
            const { fsPath } = Uri;
            if (fsPath.endsWith('.ahk')) {
                Detecter.updateDocDef(false, fsPath);
            }
        }
    },

    renameFileName(e: vscode.FileRenameEvent): void {
        for (const { oldUri, newUri } of e.files) {
            if (oldUri.fsPath.endsWith('.ahk') && newUri.fsPath.endsWith('.ahk')) {
                Detecter.DocMap.delete(oldUri.fsPath);
                Detecter.diagColl.delete(oldUri);
                Detecter.updateDocDef(false, newUri.fsPath);
                const fsPathList = Detecter.getDocMapFile();
                renameFileNameFunc(oldUri, newUri, [...fsPathList]);
            }
        }
    },

    async updateDocDef(isTest: boolean, fsPath: string): Promise<vscode.DocumentSymbol[]> {
        const Uri = vscode.Uri.file(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        const gValMapBySelf: TGValMap = new Map<TValName, TValArray>();

        const DocStrMap = Pretreatment(document.getText().split('\n'), 0);
        const result = getChildren({
            gValMapBySelf,
            Uri,
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            inClass: false,
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
        });

        if (!fsPath.includes(EStr.diff_name_prefix)) {
            if (!isTest) showTimeSpend(document.uri, timeStart);
            Detecter.DocMap.set(fsPath, result);
            Detecter.globalValMap.set(fsPath, gValMapBySelf);
            Diagnostic(DocStrMap, result, Uri, Detecter.diagColl);
        }
        return result as vscode.DocumentSymbol[];
    },

    async buildByPathAsync(isTest: boolean, buildPath: string): Promise<void> {
        if (fs.statSync(buildPath).isDirectory()) {
            const files = fs.readdirSync(buildPath);
            for (const file of files) {
                if (!getIgnoredFolder(file)) {
                    await Detecter.buildByPathAsync(isTest, `${buildPath}/${file}`);
                }
            }
        } else if (buildPath.endsWith('.ahk') && !getIgnoredFile(buildPath)) {
            // const Uri = vscode.Uri.file(buildPath);
            await Detecter.updateDocDef(isTest, vscode.Uri.file(buildPath).fsPath);
        }
    },
};
