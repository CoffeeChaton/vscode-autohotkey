/* eslint-disable max-lines */
/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import getLocation from '../tools/getLocation';
import { removeSpecialChar, removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { showTimeSpend, getAhkVersion } from '../configUI';
import { EMode } from '../tools/globalSet';

class AhkSymBolTools {
    private static readonly matchList: readonly RegExp[] = [
        /^loop[\s,%][\s,%]*(\w\w*)/i,
        /^for[\s,\w]+in\s\s*(\w\w*)/i,
        /^switch\s\s*(\w\w*)/i,
        // ----------------------
        /^static\b(\w\w*)/i,
        /^case\s\s*([^:][^:]*):/i,
        /^default(\s)\s*:/i,
        /^GoSub[\s,][\s,]*(\w\w*)/i,
        /^GoTo[\s,][\s,]*(\w\w*)/i,
        /^(\w.?\w):$/, // Label:
        /\bnew\b\s\s*(\w\w*)/i, //  := new
        /^:[^:]*?:([^:][^:]*)::/, // HotStr
        /^([^:][^:]*)::/, // HotKeys
        /^#(\w\w*)/, // directive
        /^global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^throw[\s,][\s,]*(.+)/i, // throw
    ];

    private static readonly nameList: readonly string[] = [
        'Loop ',
        'For ',
        'Switch ',
        //--------------------------
        'Static ',
        'Case ', // TODO Case Block use switch deep
        'Default',
        'GoSub ',
        'GoTo ',
        'Label ',
        'new ',
        '', // HotStr
        '', // HotKeys
        '#', // directive
        'global ',
        'Throw ',
    ];

    private static readonly kindList: readonly vscode.SymbolKind[] = [
        // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        //--------------
        vscode.SymbolKind.Variable, // Static
        vscode.SymbolKind.Variable, // Case
        vscode.SymbolKind.Variable, // Default
        vscode.SymbolKind.Variable, // GoSub
        vscode.SymbolKind.Variable, // GoTo
        vscode.SymbolKind.Package, // Label
        vscode.SymbolKind.Object, //  Object
        vscode.SymbolKind.Event, // HotStr
        vscode.SymbolKind.Event, // HotKeys
        vscode.SymbolKind.Event, // directive
        vscode.SymbolKind.Variable, // Global
        vscode.SymbolKind.Event, // Throw
    ];

    private static readonly findBlockList: readonly boolean[] = [
        true,
        true,
        true,
        //----------------
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ];

    public static getReturnByLine(document: vscode.TextDocument, line: number, textFix: string): vscode.SymbolInformation | null {
        const ReturnMatch = textFix.match(/\breturn\b[\s,][\s,]*(.+)/i);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const Func = name.match(/^(\w\w*)\(/);
            if (Func) {
                name = `${Func[1]}(...)`;
            } else {
                const obj = name.match(/^(\{\s*\w\w*\s*:)/);
                if (obj) name = `obj ${obj[1]}`;
            }

            const Location = new vscode.Location(document.uri, document.lineAt(line).range);
            return new vscode.SymbolInformation(`Return ${name.trim()}`, vscode.SymbolKind.Variable, '', Location);
        }
        return null;
    }

    public static getSymbolByLine(document: vscode.TextDocument, line: number, textFix: string): vscode.SymbolInformation | null {
        const {
            matchList, findBlockList, kindList, nameList,
        } = AhkSymBolTools;
        for (let i = 0; i < matchList.length; i += 1) {
            const BlockSymbol = textFix.match(matchList[i]);
            if (BlockSymbol) {
                const Location = findBlockList[i]
                    ? getLocation(document, line, line)
                    : new vscode.Location(document.uri, document.lineAt(line).range);
                return new vscode.SymbolInformation(`${nameList[i]}${BlockSymbol[1]}`, kindList[i], '', Location);
            }
        }
        return null;
    }

    public static getCommentBlockSymbol(document: vscode.TextDocument, line: number, text: string): vscode.SymbolInformation | null {
        const kind = vscode.SymbolKind.Package;

        const CommentBlock = text.trim().search(/^\{\s\s*;;/);
        if (CommentBlock > -1) {
            const name = text.substr(text.indexOf(';;') + 2).trim();
            return new vscode.SymbolInformation(name, kind, '', getLocation(document, line, line));
        }

        const CommentLine = text.indexOf(';;');
        if (CommentLine > -1) {
            const name = text.substr(CommentLine + 2).trim();
            const Location = new vscode.Location(document.uri,
                new vscode.Range(new vscode.Position(line, CommentLine),
                    new vscode.Position(line, text.length)));
            return new vscode.SymbolInformation(name, kind, '', Location);
        }

        return null;
    }

    public static getClassByLine(document: vscode.TextDocument, textFix: string, line: number): vscode.SymbolInformation | null {
        const classDefReg = /^class\b\s\s*(\w\w+)/i;
        const classMatch = textFix.match(classDefReg);
        if (classMatch === null) return null;
        const Location = getLocation(document, line, line);// 95% case of 'class keyword line' === 'first block line'
        return new vscode.SymbolInformation(classMatch[1], vscode.SymbolKind.Class, '', Location);
    }

    public static getFuncByLine(document: vscode.TextDocument, textFix: string, line: number): vscode.SymbolInformation | null {
        const getFuncTail = (searchText: string, name: string, searchLine: number) => {
            const kind = vscode.SymbolKind.Function;
            const fnTail = /\)\s*\{$/;
            const fnTail2 = /\)$/;
            const fnTail3 = /^{/;
            // i+1   ^, something , something ........ ) {$
            if (searchText.search(fnTail) > -1) {
                return new vscode.SymbolInformation(name, kind, '', getLocation(document, line, searchLine));
            }

            if (searchLine + 1 === document.lineCount) return null;
            // i+1   ^, something , something ......)$
            // i+2   ^{
            if (searchText.search(fnTail2) > -1) {
                const nextLine = removeSpecialChar2(document.lineAt(searchLine + 1).text).trim();// i+2
                if (nextLine.search(fnTail3) !== 0) return null;
                return new vscode.SymbolInformation(name, kind, '', getLocation(document, line, searchLine));
            }
            return null;
        };

        const fnHeadMatch = /^(\w\w*)\(/;
        const fnHead = textFix.match(fnHeadMatch);
        if (fnHead === null) return null;
        const name = fnHead[1];
        const thisLine = getFuncTail(textFix, name, line);
        if (thisLine) return thisLine;

        const justThisLine = removeSpecialChar(document.lineAt(line).text).trim();
        if (justThisLine.indexOf(')') > -1) return null;// fn_Name( ... ) ...  ,this is not ahk function

        const iMaxRule = 15;
        const iMax = Math.min(line + iMaxRule, document.lineCount, 10000) - 1;

        for (let searchLine = line + 1; searchLine < iMax; searchLine += 1) {
            const searchText = removeSpecialChar2(document.lineAt(searchLine).text).trim();
            if (searchText.search(/^,/) === -1) return null;

            const iLine = getFuncTail(searchText, name, searchLine);
            if (iLine) return iLine;
        }
        return null;
    }
}


export class Detecter {
    private static AhkClassDefMap: Map<string, vscode.SymbolInformation[]> = new Map(); // TODO AhkClassMap add Method Property

    private static AhkFuncMap: Map<string, vscode.SymbolInformation[]> = new Map();

    public static getCacheFileUri(): IterableIterator<string> {
        return Detecter.AhkFuncMap.keys();// === Detecter.AhkClassDefMap.keys();
    }

    // eslint-disable-next-line max-statements
    private static async getDocDefCore(uri: vscode.Uri): Promise<vscode.SymbolInformation[]> {
        const document = await vscode.workspace.openTextDocument(uri);
        const result: vscode.SymbolInformation[] = [];
        const funcList: vscode.SymbolInformation[] = [];
        const classList: vscode.SymbolInformation[] = [];
        const isAHKv2 = getAhkVersion();
        let BodyEndLine = 0;
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        const timeStart = Date.now();
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);

            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;

            const CommentBlockSymbol = AhkSymBolTools.getCommentBlockSymbol(document, line, text);
            if (CommentBlockSymbol) result.push(CommentBlockSymbol);

            const textFix = removeSpecialChar(text).trim();
            if (textFix === '' || getSkipSign(textFix)) continue;

            const ahkClass = AhkSymBolTools.getClassByLine(document, textFix, line);
            if (ahkClass) {
                classList.push(ahkClass);
                result.push(ahkClass);
                continue;
            }
            if (isAHKv2 || line >= BodyEndLine) { // ahk v1 can't use Nested function
                const func = AhkSymBolTools.getFuncByLine(document, textFix, line);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    funcList.push(func); // TODO check Range.contains(positionOrRange: Position | Range): boolean
                    result.push(func);
                    continue;
                }
            }
            const ReturnValue = AhkSymBolTools.getReturnByLine(document, line, textFix);
            if (ReturnValue) result.push(ReturnValue);

            const BlockSymbol = AhkSymBolTools.getSymbolByLine(document, line, textFix);
            if (BlockSymbol) result.push(BlockSymbol);
        }
        showTimeSpend(document.uri, timeStart);
        const { fsPath } = document.uri;
        Detecter.AhkFuncMap.set(fsPath, funcList);
        Detecter.AhkClassDefMap.set(fsPath, classList);
        return result;
    }

    public static async getDocDef(fsPath: string, mode: EMode, Update: boolean): Promise<vscode.SymbolInformation[] | null> {
        const ahkSymbol = Update ? Detecter.getDocDefCore(vscode.Uri.file(fsPath)) : null;

        switch (mode) {
            case EMode.ahkFunc:
                return Detecter.AhkFuncMap.get(fsPath) || null;
            case EMode.ahkClass:
                return Detecter.AhkClassDefMap.get(fsPath) || null;
            case EMode.ahkVoid:
                return null;
            case EMode.ahkAll:
                if (Update) return ahkSymbol;
                vscode.window.showErrorMessage('--------ERROR----270');
                return Detecter.getDocDefCore(vscode.Uri.file(fsPath));
            default:
                vscode.window.showErrorMessage('--------ERROR----273');
                return Detecter.getDocDefCore(vscode.Uri.file(fsPath));
        }
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
            Detecter.getDocDef(buildPath, EMode.ahkVoid, true);
        }
    }
}
