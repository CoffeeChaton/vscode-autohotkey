/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import { getChildren } from './getChildren';
import { ParserLine, ParserBlock, getReturnByLine } from './Parser';
import { showTimeSpend } from '../configUI';
import { EStr, MyDocSymbolArr } from '../globalEnum';
import { renameFn as renameFileNameFunc } from './renameFileNameFunc';
import { Pretreatment } from '../tools/Pretreatment';
import { Diagnostic } from '../provider/Diagnostic/Diagnostic';

export const Detecter = {
    // key : vscode.Uri.fsPath,
    // val : vscode.DocumentSymbol[]
    DocMap: new Map() as Map<string, MyDocSymbolArr>,

    // diagColl : vscode.DiagnosticCollection
    diagColl: vscode.languages.createDiagnosticCollection('ahk-neko-help'),

    getDocMapFile(): IterableIterator<string> {
        return Detecter.DocMap.keys();
    },

    getDocMap(fsPath: string): null | MyDocSymbolArr {
        //  const Uri = vscode.Uri.file(fsPath);
        return Detecter.DocMap.get(fsPath) || null;
    },

    delMap(e: vscode.FileDeleteEvent): void {
        for (const Uri of e.files) {
            const fsPath = Uri.fsPath;
            if (fsPath.endsWith('.ahk')) {
                Detecter.DocMap.delete(fsPath);
            }
            Detecter.diagColl.delete(Uri);
        }
    },

    createMap(e: vscode.FileCreateEvent): void {
        for (const Uri of e.files) {
            const fsPath = Uri.fsPath;
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
        // FIXME -> event
        // FIXME wm -> Map<fsPath,WeakMap<MyDocSymbol, T>>;
        const Uri = vscode.Uri.file(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        // eslint-disable-next-line no-magic-numbers
        // const size = Math.round(fs.statSync(fsPath).size / 1024);
        // console.log(fsPath, `${size} KB`);

        const DocStrMap = Pretreatment(document.getText().split('\n'));
        // DocStrMap.forEach((e) => {
        //     console.log('lStr', e.lStr);
        //     console.log('tRaw', e.textRaw);
        // });
        const result = getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            inClass: false,
            // eslint-disable-next-line @typescript-eslint/unbound-method
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
        });

        if (!fsPath.includes(EStr.diff_name_prefix)) {
            if (!isTest) showTimeSpend(document.uri, timeStart);
            Detecter.DocMap.set(fsPath, result);
            Diagnostic(DocStrMap, result, Uri, Detecter.diagColl);
        }
        return result as vscode.DocumentSymbol[];
    },

    buildByPath(isTest: boolean, buildPath: string): void {
        if (fs.statSync(buildPath).isDirectory()) {
            fs.readdir(buildPath, (err, files) => {
                if (err) {
                    Out.log(err);
                    return;
                }
                for (const file of files) {
                    if (!file.startsWith('.')
                        && !(/^out$/i).test(file)
                        && !(/^target$/i).test(file)) {
                        // TODO read back file
                        Detecter.buildByPath(isTest, `${buildPath}/${file}`);
                    }
                }
            });
        } else if (buildPath.endsWith('.ahk')) {
            // const Uri = vscode.Uri.file(buildPath);
            Detecter.updateDocDef(isTest, vscode.Uri.file(buildPath).fsPath);
        }
    },

    async buildByPathAsync(isTest: boolean, buildPath: string): Promise<void> {
        if (fs.statSync(buildPath).isDirectory()) {
            const files = fs.readdirSync(buildPath);
            for (const file of files) {
                if (!file.startsWith('.')
                    && !(/^out$/i).test(file)
                    && !(/^target$/i).test(file)) {
                    // TODO read back file
                    await Detecter.buildByPathAsync(isTest, `${buildPath}/${file}`);
                }
            }
        } else if (buildPath.endsWith('.ahk')) {
            // const Uri = vscode.Uri.file(buildPath);
            await Detecter.updateDocDef(isTest, vscode.Uri.file(buildPath).fsPath);
        }
    },
};
