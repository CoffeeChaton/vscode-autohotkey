/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import getLocation from '../tools/getLocation';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getAhkVersion } from '../configUI';

interface docMap {
    key: string;
    obj: vscode.SymbolInformation[] | null
}

export class Detecter {
    public static docFuncMap: docMap[] = [];

    public static getCacheFileUri(): string[] {
        const uriList: string[] = [];
        for (const fileName of this.docFuncMap) {
            if (fileName.key.match(/\b(ahk|ext)$/i)) {
                uriList.push(fileName.key);
            }
        }
        return uriList;
    }

    /**
     * load method list by path
     * @param buildPath
     */
    public static async buildByPath(buildPath: string): Promise<void> {
        if (fs.statSync(buildPath).isDirectory()) {
            fs.readdir(buildPath, (err, files) => {
                if (err) {
                    Out.log(err);
                    return;
                }
                for (const file of files) {
                    if (file.match(/(^\.|out|target|\.history)/)) {
                        continue;
                    }
                    this.buildByPath(`${buildPath}/${file}`);
                }
            });
        } else if (buildPath.match(/\b(ahk|ext)$/i)) {
            this.getFuncList(vscode.Uri.file(buildPath));
        }
    }

    /**
     * detect method list by document
     * @param document
     */
    public static async getFuncList(docId: vscode.TextDocument | vscode.Uri, usingCache = false): Promise<vscode.SymbolInformation[]> {
        const document = docId instanceof vscode.Uri
            ? await vscode.workspace.openTextDocument(docId as vscode.Uri)
            : docId as vscode.TextDocument;

        const { fsPath } = document.uri;
        let i = 0;
        let funcList: vscode.SymbolInformation[] = [];
        for (const { key, obj } of this.docFuncMap) {
            if (key === fsPath) {
                funcList = obj || [];
                break;
            }
            i += 1;
        }

        if (usingCache && funcList.length !== 0) return funcList;

        const isAHKv2 = getAhkVersion();
        let BodyEndLine: number = 0;
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            if (isAHKv2 || line >= BodyEndLine) { // ahk v1 can't use Nested function
                const func = this.getFuncByLine(document, line, lineCount);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    funcList.push(func);
                }
            }
        }

        this.docFuncMap[i] = { key: fsPath, obj: funcList };

        return funcList;
    }

    private static getContainerNameByLine(document: vscode.TextDocument, line: number): string {
        if (line > 0) {
            const { text } = document.lineAt(line - 1);
            const containerName = text.match(/^\s*;@(.+)/);
            if (containerName) return containerName[1].trim();
        }
        return '';
    }


    // eslint-disable-next-line max-statements
    public static getFuncByLine(document: vscode.TextDocument, line: number, lineCount: number): vscode.SymbolInformation | null {
        const textFix = removeSpecialChar2(document.lineAt(line).text).trim();
        if (textFix === '') return null;
        if (getSkipSign(textFix)) return null;

        const fnHeadMatch = /^(\w\w*)\(/;
        const fnHead = textFix.match(fnHeadMatch);
        if (fnHead === null) return null;

        const name = fnHead[1];
        const Remark = this.getContainerNameByLine(document, line);
        const kind = vscode.SymbolKind.Function;
        // style
        // line + 0 ^fn_Name(){$
        const fnTail = /\)\s*\{$/;
        if (textFix.search(fnTail) > -1) {
            const defLine = line;
            const searchLine = line + 0;// + 0
            return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, defLine, searchLine, lineCount));
        }

        // style
        // line +0 fn_Name( ... )$
        // line +1 ^{ ...
        const fnTail2 = /\)$/;
        if (textFix.search(fnTail2) > -1) {
            const nextLine = removeSpecialChar2(document.lineAt(line + 1).text).trim();
            if (nextLine.indexOf('{') !== 0) return null; // nextLine is not ^{
            const defLine = line;
            const searchLine = line + 1;// + 1
            return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, defLine, searchLine, lineCount));
        }

        if (textFix.indexOf(')') > -1) return null;// fn_Name( ... ) ...  ,this is not ahk function

        // https://www.autohotkey.com/docs/Scripts.htm#continuation
        // style
        // ^fn_Name( something
        // ^, something , something
        // ^, something , something
        const iMaxRule = 11;
        const iMax = Math.min(line + iMaxRule, lineCount);
        for (let i = line; i < iMax; i += 1) {
            const nextLine = removeSpecialChar2(document.lineAt(i + 1).text).trim();
            if (nextLine.indexOf(',') !== 0) return null;

            // i+1   ^, something , something ........ ) {$
            if (nextLine.search(/\)\s*\{$/) > -1) {
                const defLine = line;
                const searchLine = i;// i
                return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, defLine, searchLine, lineCount));
            }

            // i+1   ^, something , something ......)$
            // i+2   ^{
            if (nextLine.search(/\)$/) > -1) {
                const iLine2 = removeSpecialChar2(document.lineAt(i + 2).text).trim();// i+2
                if (iLine2.search(/^\{/) !== 0) return null;
                const defLine = line;
                const searchLine = i + 1;// + 1
                return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, defLine, searchLine, lineCount));
            }
        }
        return null;
    }

    public static async getFuncReference(fileName: string, wordReg: RegExp): Promise<vscode.Location[]> {
        const document = await vscode.workspace.openTextDocument(fileName);
        const LocationList2: vscode.Location[] = [];

        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            const textFix = removeSpecialChar2(text).trim();
            const textFixPos = textFix.search(wordReg);
            if (textFixPos > -1) {
                LocationList2.push(new vscode.Location(document.uri, new vscode.Position(line, text.search(wordReg))));
            }
        }

        return LocationList2;
    }

    public static async AhkFuncReference(wordReg: RegExp): Promise<vscode.Location[]> {
        const List: vscode.Location[] = [];
        for (const fileName of Detecter.getCacheFileUri()) {
            // eslint-disable-next-line no-await-in-loop
            const iLocations = await this.getFuncReference(fileName, wordReg);
            for (const iLocation of iLocations) { // for ( vscode.Location of vscode.Location[] )
                List.push(iLocation);
            }
        }
        return List;
    }
}
