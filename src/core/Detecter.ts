/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import { Core, getChildren, LineClass } from '../tools/getChildren';
import type { funcLimit } from '../tools/getChildren';
import { showTimeSpend } from '../configUI';

export const Detecter = {
    DocMap: new Map() as Map<string, vscode.DocumentSymbol[]>,

    getDocMapFile(): IterableIterator<string> {
        return Detecter.DocMap.keys();
    },

    getDocMap(fsPath: string): readonly vscode.DocumentSymbol[] | undefined {
        return Detecter.DocMap.get(fsPath);
    },

    async updateDocDef(fsPath: string): Promise<vscode.DocumentSymbol[]> {
        const Uri = vscode.Uri.file(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        const RangeEnd = Math.min(document.lineCount, 10000);
        const inClass = false;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const fnList: funcLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
        const result: vscode.DocumentSymbol[] = getChildren(document, -1, RangeEnd, inClass, fnList);
        showTimeSpend(document.uri, timeStart);

        Detecter.DocMap.set(Uri.fsPath, result);
        return result;
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
            Detecter.updateDocDef(buildPath);
        }
    },
};
