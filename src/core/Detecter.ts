/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import getSymbolEndLine from '../tools/getSymbolEndLine';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';

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

        const path = document.uri.fsPath;
        let i = 0;
        let funcList: vscode.SymbolInformation[] = [];
        for (const { key, obj } of this.docFuncMap) {
            if (key === path) {
                funcList = obj || [];
                break;
            }
            i += 1;
        }

        if (usingCache && funcList.length !== 0) return funcList;

        let BodyEndLine: number = 0;
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            if (line >= BodyEndLine) { // ahk v1 can't use Nested function
                const func = this.getFuncByLine(document, line, lineCount);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    funcList.push(func);
                }
            }
        }

        this.docFuncMap[i] = { key: path, obj: funcList };

        return funcList;
    }

    private static getRemarkByLine(document: vscode.TextDocument, line: number): string {
        if (line > 0) {
            const { text } = document.lineAt(line - 1);
            const RemarkMatch = text.match(/^\s*;@(.+)/);
            if (RemarkMatch) return RemarkMatch[1].trim();
        }
        return '';
    }

    public static getFuncByLine(document: vscode.TextDocument, line: number, lineCount: number): vscode.SymbolInformation | null {
        const { text } = document.lineAt(line);
        const textFix = removeSpecialChar(text, true).trim();
        if (textFix === '') return null;
        if (getSkipSign(textFix)) return null;

        const fnHeadMatch = /^(\w\w*)\(/;
        const fnHead = textFix.match(fnHeadMatch);
        if (fnHead === null) return null;

        const name = fnHead[1];
        const Remark = this.getRemarkByLine(document, line);

        // style
        // line + 0 ^fn_Name(){$
        const fnTail = /\)\s*\{$/;
        if (textFix.search(fnTail) > -1) {
            const startLine = line + 0;// + 0
            const Range = getSymbolEndLine(document, startLine, lineCount, new vscode.Position(line, 0));
            return new vscode.SymbolInformation(name, vscode.SymbolKind.Method, Remark,
                new vscode.Location(document.uri, Range));
        }

        // style
        // line +0 fn_Name( ... )$
        // line +1 ^{ ...
        const fnTail2 = /\)$/;
        if (textFix.search(fnTail2) > -1) {
            const nextLine = removeSpecialChar(document.lineAt(line + 1).text, true).trim();
            if (nextLine.indexOf('{') !== 0) return null; // nextLine is not ^{

            const startLine = line + 1;// + 1
            const Range = getSymbolEndLine(document, startLine, lineCount, new vscode.Position(line, 0));
            return new vscode.SymbolInformation(name, vscode.SymbolKind.Method, Remark,
                new vscode.Location(document.uri, Range));
        }

        if (textFix.indexOf(')') > -1) return null;// fn_Name( ... ) something ,this is not ahk function
        return this.getAhkMultiRowFunc(document, line, lineCount, Remark, name);
    }

    private static getAhkMultiRowFunc(document: vscode.TextDocument, line: number,
        lineCount: number, Remark: string, name: string): vscode.SymbolInformation | null {
        // https://www.autohotkey.com/docs/Scripts.htm#continuation
        // style
        // ^fn_Name( something
        // ^, something , something
        // ^, something , something
        const iMaxRule = 11;
        const iMax = Math.min(line + iMaxRule, lineCount);
        for (let i = line; i < iMax; i += 1) {
            const nextLine = removeSpecialChar(document.lineAt(i + 1).text, true).trim();
            if (nextLine.indexOf(',') !== 0) return null;

            // i+1   ^, something , something ........ ) {$
            if (nextLine.search(/\)\s*\{$/) > -1) {
                const startLine = i;// i
                const Range = getSymbolEndLine(document, startLine, lineCount, new vscode.Position(line, 0));
                return new vscode.SymbolInformation(name, vscode.SymbolKind.Method, Remark, new vscode.Location(document.uri, Range));
            }

            // i+1   ^, something , something ......)$
            // i+2   ^{
            if (nextLine.search(/\)$/) > -1) {
                const iLine2 = removeSpecialChar(document.lineAt(i + 2).text, true).trim();// i+2
                if (iLine2.search(/^\{/) !== 0) return null;

                const startLine = i + 1;// + 1
                const Range = getSymbolEndLine(document, startLine, lineCount, new vscode.Position(line, 0));
                return new vscode.SymbolInformation(name, vscode.SymbolKind.Method, Remark, new vscode.Location(document.uri, Range));
            }
        }
        return null;
    }
}
