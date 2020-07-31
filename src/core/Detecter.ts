/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import { Core, getChildren, LineClass } from '../tools/getChildren';
import type { funcLimit } from '../tools/getChildren';
import { showTimeSpend } from '../configUI';
import { EMode } from '../tools/globalSet';

export const Detecter = {
    AhkClassDefMap: new Map() as Map<string, vscode.DocumentSymbol[]>,

    AhkFuncMap: new Map() as Map<string, vscode.DocumentSymbol[]>,

    DocMap: new Map() as Map<string, vscode.DocumentSymbol[]>,

    getCacheFileUri(): IterableIterator<string> {
        return Detecter.DocMap.keys();
    },

    getClassMap(): Map<string, vscode.DocumentSymbol[]> {
        return Detecter.AhkClassDefMap;
    },

    getFuncMap(): Map<string, vscode.DocumentSymbol[]> {
        return Detecter.AhkFuncMap;
    },

    async getDocDefCore(fsPath: string): Promise<vscode.DocumentSymbol[]> {
        const Uri = vscode.Uri.file(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        const RangeEnd = Math.min(document.lineCount, 10000);
        const classList: vscode.DocumentSymbol[] = [];
        const fuList: vscode.DocumentSymbol[] = [];
        const inClass = false;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const fnList: funcLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
        const result: vscode.DocumentSymbol[] = getChildren(document, -1, RangeEnd, inClass, fnList);
        showTimeSpend(document.uri, timeStart);

        const iMax = result.length;
        for (let i = 0; i < iMax; i += 1) {
            if (result[i].kind === vscode.SymbolKind.Class) classList.push(result[i]);
            if (result[i].kind === vscode.SymbolKind.Function) fuList.push(result[i]);
        }

        Detecter.AhkClassDefMap.set(Uri.fsPath, classList);
        Detecter.AhkFuncMap.set(Uri.fsPath, fuList);
        Detecter.DocMap.set(Uri.fsPath, result);

        return result;
    },

    getDocDefQuick(fsPath: string, mode: EMode): readonly vscode.DocumentSymbol[] | undefined {
        switch (mode) {
            case EMode.ahkFunc:
                return Detecter.AhkFuncMap.get(fsPath);
            case EMode.ahkClass:
                return Detecter.AhkClassDefMap.get(fsPath);
            case EMode.ahkAll:
                return Detecter.DocMap.get(fsPath);
            default:
                console.log(': --------ERROR----271--83--mode is');
                console.log('Detecter -> getDocDefQuick -> mode', mode);
                return undefined;
        }
    },

    async getDocDef(fsPath: string): Promise<vscode.DocumentSymbol[]> {
        return Detecter.getDocDefCore(fsPath);
    },

    buildByPath(buildPath: string): void {
        if (fs.statSync(buildPath).isDirectory()) {
            fs.readdir(buildPath, (err, files) => {
                if (err) {
                    Out.log(err);
                    return;
                }
                for (const file of files) {
                    if (!(/^\.|out|target|\.history/).test(file)) {
                        Detecter.buildByPath(`${buildPath}/${file}`);
                    }
                }
            });
        } else if ((/\.(?:ahk|ext)$/i).test(buildPath)) {
            Detecter.getDocDef(buildPath);
        }
    },
};
