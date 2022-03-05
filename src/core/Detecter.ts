/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as vscode from 'vscode';
import { showTimeSpend } from '../configUI';
import {
    EStr,
    TAhkSymbolList,
    TGlobalVal,
    TGValMap,
    TValUpName,
} from '../globalEnum';
import { baseDiagnostic } from '../provider/Diagnostic/Diagnostic';
import { renameFileNameFunc } from '../provider/event/renameFileNameFunc';
import { diagDAFile } from '../tools/DeepAnalysis/Diag/diagDA';
import { Pretreatment } from '../tools/Pretreatment';
import { hashCode } from '../tools/str/hashCode';
import { diagColl } from './diagRoot';
import { getChildren } from './getChildren';
import { globalValMap } from './Global';
import { getReturnByLine, ParserBlock } from './Parser';
import { ParserLine } from './ParserTools/ParserLine';

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
        const Uri = vscode.Uri.file(fsPath);
        globalValMap.delete(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const gValMapBySelf: TGValMap = new Map<TValUpName, TGlobalVal[]>();
        const timeStart = Date.now();

        const fullText = document.getText();
        const hash = hashCode(fullText);
        const a = 0; // just test eslint is working, or not
        const DocStrMap = Pretreatment(fullText.split('\n'), 0);
        const AhkSymbolList: TAhkSymbolList = getChildren({
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
            Detecter.DocMap.set(fsPath, AhkSymbolList);
            globalValMap.set(fsPath, gValMapBySelf);
            baseDiagnostic(DocStrMap, AhkSymbolList, Uri, diagColl);
            // TODO debounce of deepDiag A File // );
            if (useDeepAnalysis) {
                // console.log('🚀 ~ file size', document.getText().length);
                // Gdip_all_2020_08_24 -> 2^18 ~ 2^19
                diagDAFile(AhkSymbolList, document, Uri);

                console.log('🚀 ~ updateDocDef ~ hash', hash);
                console.log('🚀 ~ updateDocDef ~ hash', Date.now() - timeStart, 'ms'); //  gdip_all_20xx just need 1ms
            }
        }
        return AhkSymbolList as vscode.DocumentSymbol[];
    },
};
