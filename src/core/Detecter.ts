/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import { Core, getChildren, LineClass } from '../tools/getChildren';
import type { FuncLimit } from '../tools/getChildren';
import { showTimeSpend } from '../configUI';

export const Detecter = {
    DocMap: new Map() as Map<vscode.Uri, vscode.DocumentSymbol[]>,

    getDocMapFile(): IterableIterator<vscode.Uri> {
        return Detecter.DocMap.keys();
    },

    getDocMap(Uri: vscode.Uri): readonly vscode.DocumentSymbol[] | undefined {
        //  const Uri = vscode.Uri.file(fsPath);
        return Detecter.DocMap.get(Uri);
    },

    async updateDocDef(Uri: vscode.Uri): Promise<vscode.DocumentSymbol[]> {
        // const Uri = vscode.Uri.file(fsPath);
        const document = await vscode.workspace.openTextDocument(Uri);
        const timeStart = Date.now();
        const RangeEnd = Math.min(document.lineCount, 10000);
        const inClass = false;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const fnList: FuncLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
        const result: vscode.DocumentSymbol[] = getChildren(document, -1, RangeEnd, inClass, fnList);
        showTimeSpend(document.uri, timeStart);

        Detecter.DocMap.set(Uri, result);
        return result;
    },

    buildByPath(buildPath: string): void {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (fs.statSync(buildPath).isDirectory()) {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
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
            const Uri = vscode.Uri.file(buildPath);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Detecter.updateDocDef(Uri);
        }
    },
};
