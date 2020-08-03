/* eslint-disable security/detect-object-injection */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as vscode from 'vscode';
import { getFuncDef } from './getFuncDef';
import { getRange } from './getRange';
import { removeSpecialChar, removeSpecialChar2, getSkipSign } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';
import { inLTrimRange } from './inLTrimRange';
// import * as Oniguruma from 'vscode-oniguruma';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type FuncLimit = (document: Readonly<vscode.TextDocument>, textFix: Readonly<string>,
    line: Readonly<number>, RangeEnd: Readonly<number>, inClass: Readonly<boolean>) => Readonly<vscode.DocumentSymbol> | false;

export function getChildren(document: vscode.TextDocument,
    RangeStart: number, RangeEnd: number, inClass: boolean, fnList: FuncLimit[]): Readonly<vscode.DocumentSymbol>[] {
    const result = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    let Resolved = -1;
    const iMax = fnList.length;
    for (let line = RangeStart + 1; line < RangeEnd; line += 1) {
        if (line < Resolved) continue;
        const textRaw = document.lineAt(line).text;

        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) continue;

        const textFix = removeSpecialChar2(textRaw).trim();
        if (textFix === '' || getSkipSign(textFix)) continue;

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim) continue;

        for (let i = 0; i < iMax; i += 1) {
            const DocumentSymbol: Readonly<vscode.DocumentSymbol> | false = fnList[i](document, textFix, line, RangeEnd, inClass);
            if (DocumentSymbol) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line;
                continue;
            }
        }
    }
    return result;
}

interface LineClassI {
    matchListOne: readonly RegExp[];
    nameListOne: readonly string[];
    kindListOne: readonly vscode.SymbolKind[];
    getReturnByLine: FuncLimit;
    getLine: FuncLimit;
}

export const LineClass: Readonly<LineClassI> = Object.freeze({
    matchListOne: Object.freeze([
        /^static\s\s*(\w\w*)/i,
        /^case\s\s*([^:][^:]*):/i, // FIXME
        /^default(\s)\s*:/i,
        /^GoSub[\s,][\s,]*(\w\w*)/i,
        /^GoTo[\s,][\s,]*(\w\w*)/i,
        /^(\w\w*):$/, // Label:
        /^(\w\w*)\s*:=\s*\bnew\b/i, // objName := new className
        /^:[^:]*?:([^:][^:]*)::/, // HotStr
        /^([^:][^:]*?)::/, // HotKeys
        /^#(\w\w*)/, // directive
        /^global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^throw[\s,][\s,]*(.+)/i, // throw
        /^exit\b[\s,][\s,]*(.+)/i, // FIXME *99
        /^exitApp\b[\s,][\s,]*(.+)/i,
        /^pause\b[\s,][\s,]*(.+)/i,
        /^(reload)\b/i,
    ]),

    nameListOne: Object.freeze([
        'Static ',
        'Case ', // TODO Case Block use switch deep
        'Default',
        'GoSub ',
        'GoTo ',
        'Label ',
        '', // new
        '', // HotStr
        '', // HotKeys
        '#', // directive
        '', // global
        'Throw ',
        'exit ',
        'exitApp ',
        'pause ',
        '', // reload
    ]),

    kindListOne: Object.freeze([
        // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
        vscode.SymbolKind.Variable, // Static
        vscode.SymbolKind.Enum, // Case
        vscode.SymbolKind.Enum, // Default
        vscode.SymbolKind.Variable, // GoSub
        vscode.SymbolKind.Variable, // GoTo
        vscode.SymbolKind.Package, // Label
        vscode.SymbolKind.Object, //  Object
        vscode.SymbolKind.Event, // HotStr
        vscode.SymbolKind.Event, // HotKeys
        vscode.SymbolKind.Event, // directive
        vscode.SymbolKind.Variable, // global
        vscode.SymbolKind.Event, // Throw
        vscode.SymbolKind.Event, // exit
        vscode.SymbolKind.Event, // exitApp
        vscode.SymbolKind.Event, // pause
        vscode.SymbolKind.Event, // reload
    ]),

    getReturnByLine(document: vscode.TextDocument, textFix: string, line: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const ReturnMatch = (/\breturn\b[\s,][\s,]*(.+)/i).exec(textFix);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const Func = (/^(\w\w*)\(/).exec(name);
            if (Func) {
                name = `${Func[1]}(...)`;
            } else {
                const obj = (/^(\{\s*\w\w*\s*:)/).exec(name);
                if (obj) name = `ahkObject ${obj[1]}`;
            }
            const rangeRaw = document.lineAt(line).range;
            return Object.freeze(new vscode.DocumentSymbol(`Return ${name.trim()}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw));
        }
        return false;
    },

    getLine(document: vscode.TextDocument, textFix: string, line: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const textFix1 = removeSpecialChar(document.lineAt(line).text).trim();
        const iMax = LineClass.matchListOne.length;
        for (let i = 0; i < iMax; i += 1) {
            const oneLineSymbol = LineClass.matchListOne[i].exec(textFix1);
            if (oneLineSymbol) {
                const rangeRaw = document.lineAt(line).range;
                const name = `${LineClass.nameListOne[i]}${oneLineSymbol[1].trim()}`;
                return Object.freeze(new vscode.DocumentSymbol(name,
                    '', LineClass.kindListOne[i], rangeRaw, rangeRaw));
            }
        }
        const ReturnValue = LineClass.getReturnByLine(document, textFix1, line, RangeEnd, inClass);
        if (ReturnValue) return ReturnValue;
        return false;
    },
});

interface CoreI {
    matchList: readonly RegExp[];
    nameList: readonly string[];
    kindList: readonly vscode.SymbolKind[];
    getSwitchBlock: FuncLimit;
    getFunc: FuncLimit;
    getClass: FuncLimit;
    getComment: FuncLimit;
}

export const Core: Readonly<CoreI> = Object.freeze({
    matchList: Object.freeze([
        // /^loop[\s,%][\s,%]*(\w\w\w\w*)/i,
        // /^for\b[\s,\w]+in\s\s*(\w\w\w\w*)/i,
        /^switch\s\s*(\S\S*)\{?/i,
    ]),

    nameList: Object.freeze([
        // 'Loop ',
        // 'For ',
        'Switch ',
    ]),

    kindList: Object.freeze([
        // vscode.SymbolKind.Package,
        // vscode.SymbolKind.Package,
        vscode.SymbolKind.EnumMember,
    ]),

    getSwitchBlock(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const iMax = Core.matchList.length;
        for (let i = 0; i < iMax; i += 1) {
            const BlockSymbol = Core.matchList[i].exec(textFix);
            if (BlockSymbol) {
                const Range = getRange(document, line, line, RangeEnd);
                // if (Range.start.line + 1 === Range.end.line) {
                //     ; //FIXME
                // }
                const selectionRange = document.lineAt(line).range;
                const Block = new vscode.DocumentSymbol(`${Core.nameList[i]}${BlockSymbol[1]}`, '',
                    Core.kindList[i], Range, selectionRange);
                const fnList: FuncLimit[] = [Core.getComment, Core.getSwitchBlock, LineClass.getLine];
                Block.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
                return Object.freeze(Block);
            }
        }
        return false;
    },

    getFunc(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const wrapper = (searchLine: number, name: string): Readonly<vscode.DocumentSymbol> => {
            const getDetail = (): string => {
                if (line === 0) return '';
                const PreviousLineText = document.lineAt(line - 1).text.trim();
                if (PreviousLineText.startsWith(';@')) return PreviousLineText.substr(2);// 2=== ';@'.len
                return '';
            };
            const Range = getRange(document, line, searchLine, RangeEnd);
            const kind = inClass ? vscode.SymbolKind.Method : vscode.SymbolKind.Function;
            const detail = getDetail();
            const selectionRange = document.lineAt(line).range;
            const funcSymbol = new vscode.DocumentSymbol(name, detail, kind, Range, selectionRange);
            const fnList: FuncLimit[] = [Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
            funcSymbol.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
            return Object.freeze(funcSymbol);
        };
        const isFunc = getFuncDef(document, line);
        if (isFunc === false) return false;

        return wrapper(isFunc.searchLine, isFunc.name);
    },

    getClass(document: vscode.TextDocument, textFix: string, line: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const classExec = (/^class\b\s\s*(\w\w*)/i).exec(textFix);
        if (classExec === null) return false;
        const Range = getRange(document, line, line, RangeEnd);
        const selectionRange = document.lineAt(line).range;
        const classSymbol = new vscode.DocumentSymbol(classExec[1], '', vscode.SymbolKind.Class, Range, selectionRange);
        const fnList: FuncLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
        classSymbol.children = getChildren(document, Range.start.line, Range.end.line, true, fnList);
        return Object.freeze(classSymbol);
    },

    getComment(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | false {
        const kind = vscode.SymbolKind.Package;
        const textRaw = document.lineAt(line).text;

        const Comments = textRaw.search(/^\s*{\s\s*;;/);
        if (Comments > -1) {
            const name = textRaw.substr(textRaw.indexOf(';;') + 2).trimEnd();
            const Range = getRange(document, line, line, RangeEnd);
            const selectionRange = document.lineAt(line).range;
            const CommentBlock = new vscode.DocumentSymbol(name, '', kind, Range, selectionRange);
            const fnList: FuncLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine];
            CommentBlock.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
            return Object.freeze(CommentBlock);
        }

        const CommentLine = textRaw.search(/^\s*;;/);
        if (CommentLine > -1) {
            const name = textRaw.substr(CommentLine + 2).trimEnd();
            const Range = new vscode.Range(new vscode.Position(line, CommentLine), new vscode.Position(line, textRaw.length));
            return Object.freeze(new vscode.DocumentSymbol(name, '', kind, Range, Range));
        }
        return false;
    },
});
