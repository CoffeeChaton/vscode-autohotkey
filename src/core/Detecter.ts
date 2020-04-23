/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import getLocation from '../tools/getLocation';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getAhkVersion } from '../configUI';
import { EMode } from '../tools/globalSet';

export class Detecter {
    private static AhkClassDefMap: Map<string, vscode.SymbolInformation[]> = new Map(); // TODO AhkClassMap add Method Property

    private static AhkFuncMap: Map<string, vscode.SymbolInformation[]> = new Map();

    public static getCacheFileUri() {
        return Detecter.AhkFuncMap.keys();
    }

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
                    Detecter.buildByPath(`${buildPath}/${file}`);
                }
            });
        } else if (buildPath.match(/\b(ahk|ext)$/i)) {
            Detecter.getDocDef(vscode.Uri.file(buildPath), EMode.ahkVoid);
        }
    }

    public static async getDocDef(uri: vscode.Uri, mode: EMode): Promise<vscode.SymbolInformation[] | null> {
        const document = await vscode.workspace.openTextDocument(uri);
        const { fsPath } = document.uri;
        const funcList: vscode.SymbolInformation[] = [];
        const classList: vscode.SymbolInformation[] = [];
        const isAHKv2 = getAhkVersion();
        let BodyEndLine: number = 0;
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            const ahkClass = Detecter.getClassByLine(document, line, lineCount);
            if (ahkClass) {
                classList.push(ahkClass);
                continue;
            }
            if (isAHKv2 || line >= BodyEndLine) { // ahk v1 can't use Nested function
                const func = Detecter.getFuncByLine(document, line, lineCount);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    funcList.push(func);
                }
            }
        }

        Detecter.AhkFuncMap.set(fsPath, funcList);

        Detecter.AhkClassDefMap.set(fsPath, classList);

        switch (mode) {
            case EMode.ahkFunc:
                return funcList;
            case EMode.ahkClass:
                return classList;
            case EMode.ahkVoid:
                return null;
            default:
                throw new Error('input mode not "func" or "class"');
        }
    }

    private static getContainerNameByLine(document: vscode.TextDocument, line: number): string {
        if (line > 0) {
            const { text } = document.lineAt(line - 1);
            const text2 = text.trim();
            const containerName = text2.match(/^;@/);
            if (containerName) return text2.trim().substr(1);
        }
        return '';
    }

    public static getClassByLine(document: vscode.TextDocument, line: number, lineCount: number): vscode.SymbolInformation | null {
        const textFix = removeSpecialChar2(document.lineAt(line).text).trim();
        if (textFix === '') return null;
        if (getSkipSign(textFix)) return null;
        const classDefReg = /^class\b\s\s*(\w\w+)/i;
        const classMatch = textFix.match(classDefReg);
        if (classMatch === null) return null;
        const Location = getLocation(document, line, line, lineCount);
        return new vscode.SymbolInformation(classMatch[1], vscode.SymbolKind.Class,
            Detecter.getContainerNameByLine(document, line), Location);
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
        const Remark = Detecter.getContainerNameByLine(document, line);
        const kind = vscode.SymbolKind.Function;

        // style
        // line + 0 ^fn_Name(){$
        const fnTail = /\)\s*\{$/;
        if (textFix.search(fnTail) > -1) {
            const searchLine = line + 0;// + 0
            return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, line, searchLine, lineCount));
        }

        // style
        // line +0 fn_Name( ... )$
        // line +1 ^{ ...
        const fnTail2 = /\)$/;
        if (textFix.search(fnTail2) > -1) {
            const nextLine = removeSpecialChar2(document.lineAt(line + 1).text).trim();
            if (nextLine.search(/^{/) === -1) return null; // nextLine is not ^{
            const searchLine = line + 1;// + 1
            return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, line, searchLine, lineCount));
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
            if (nextLine.search(/^,/) === -1) return null;

            // i+1   ^, something , something ........ ) {$
            if (nextLine.search(/\)\s*\{$/) > -1) {
                const searchLine = i;// i
                return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, line, searchLine, lineCount));
            }

            // i+1   ^, something , something ......)$
            // i+2   ^{
            if (nextLine.search(/\)$/) > -1) {
                const iLine2 = removeSpecialChar2(document.lineAt(i + 2).text).trim();// i+2
                if (iLine2.search(/^\{/) !== 0) return null;
                const searchLine = i + 1;// + 1
                return new vscode.SymbolInformation(name, kind, Remark, getLocation(document, line, searchLine, lineCount));
            }
        }
        return null;
    }
}
