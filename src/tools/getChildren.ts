/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/prefer-regexp-exec */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
/* eslint max-classes-per-file: ["error", 3] */
import * as vscode from 'vscode';
import { getFuncDef } from './getFuncDef';
import { getRange } from './getRange';
import { removeSpecialChar, removeSpecialChar2, getSkipSign } from './removeSpecialChar';
import inCommentBlock from './inCommentBlock';
// import * as Oniguruma from 'vscode-oniguruma';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type funcLimit = (document: vscode.TextDocument, textFix: string,
    line: number, RangeEnd: number, inClass: boolean) => Readonly<vscode.DocumentSymbol> | undefined;

export function getChildren(document: vscode.TextDocument,
    RangeStart: number, RangeEnd: number, inClass: boolean, fnList: funcLimit[]): Readonly<vscode.DocumentSymbol>[] {
    const result = [];
    let CommentBlock = false;
    let Resolved = -1;
    const iMax = fnList.length;
    for (let line = RangeStart + 1; line < RangeEnd; line += 1) {
        if (line < Resolved) continue;
        const textRaw = document.lineAt(line).text;

        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) continue;

        const textFix = removeSpecialChar2(textRaw).trim();
        if (textFix === '' || getSkipSign(textFix)) continue;

        for (let i = 0; i < iMax; i += 1) {
            const DocumentSymbol: Readonly<vscode.DocumentSymbol> | undefined = fnList[i](document, textFix, line, RangeEnd, inClass);
            if (DocumentSymbol) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line;
                continue;
            }
        }
    }
    return result;
}

export const LineClass = {
    matchListOne: [
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
    ] as readonly RegExp[],

    nameListOne: [
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
        'global ',
        'Throw ',
    ] as readonly string[],

    kindListOne: [
        // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
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
    ] as readonly vscode.SymbolKind[],

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getReturnByLine(document: vscode.TextDocument, line: number, textFix1: string, RangeEnd: number): Readonly<vscode.DocumentSymbol> | undefined {
        const ReturnMatch = textFix1.match(/\breturn\b[\s,][\s,]*(.+)/i);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const Func = name.match(/^(\w\w*)\(/);
            if (Func) {
                name = `${Func[1]}(...)`;
            } else {
                const obj = name.match(/^(\{\s*\w\w*\s*:)/);
                if (obj) name = `ahkObject ${obj[1]}`;
            }
            const rangeRaw = document.lineAt(line).range;
            return Object.freeze(new vscode.DocumentSymbol(`Return ${name.trim()}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw));
        }
        return undefined;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getLine(document: vscode.TextDocument, textFix2: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        line: number, RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | undefined {
        const textFix1 = removeSpecialChar(document.lineAt(line).text).trim();
        const iMax = LineClass.matchListOne.length;
        for (let i = 0; i < iMax; i += 1) {
            const oneLineSymbol = textFix1.match(LineClass.matchListOne[i]);
            if (oneLineSymbol) {
                const rangeRaw = document.lineAt(line).range;
                return Object.freeze(new vscode.DocumentSymbol(`${LineClass.nameListOne[i]}${oneLineSymbol[1]}`,
                    '', LineClass.kindListOne[i], rangeRaw, rangeRaw));
            }
        }
        const ReturnValue = LineClass.getReturnByLine(document, line, textFix1, RangeEnd);
        if (ReturnValue) return ReturnValue;
        return undefined;
    },
};

export const Core = {
    matchList: [
        /^loop[\s,%][\s,%]*(\w\w\w\w*)/i,
        /^for\b[\s,\w]+in\s\s*(\w\w\w\w*)/i,
        /^switch\s\s*(\w\w\w*)/i,
    ] as readonly RegExp[],

    nameList: [
        'Loop ',
        'For ',
        'Switch ',
    ] as readonly string[],

    kindList: [
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
    ] as readonly vscode.SymbolKind[],

    getBlock(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | undefined {
        const iMax = Core.matchList.length;
        for (let i = 0; i < iMax; i += 1) {
            const BlockSymbol = textFix.match(Core.matchList[i]);
            if (BlockSymbol) {
                const Range = getRange(document, line, line, RangeEnd); //    document.lineAt(line).range;
                const selectionRange = document.lineAt(line).range;
                const Block = new vscode.DocumentSymbol(`${Core.nameList[i]}${BlockSymbol[1]}`, '',
                    Core.kindList[i], Range, selectionRange);
                const fnList: funcLimit[] = [Core.getComment, Core.getBlock, LineClass.getLine];
                Block.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
                return Object.freeze(Block);
            }
        }
        return undefined;
    },

    getFunc(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | undefined {
        const wrapper = (searchLine: number, name: string): Readonly<vscode.DocumentSymbol> => {
            const getDetail = (): string => {
                if (line === 0) return '';
                const match = document.lineAt(line - 1).text.trim().match(/^;@(.+)/);
                if (match) return match[1];
                return '';
            };
            const Range = getRange(document, line, searchLine, RangeEnd);
            const kind = inClass ? vscode.SymbolKind.Method : vscode.SymbolKind.Function;
            const detail = getDetail();
            const selectionRange = document.lineAt(line).range;
            const funcSymbol = new vscode.DocumentSymbol(name, detail, kind, Range, selectionRange);
            const fnList: funcLimit[] = [Core.getFunc, Core.getComment, Core.getBlock, LineClass.getLine];
            funcSymbol.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
            return Object.freeze(funcSymbol);
        };
        const isFunc = getFuncDef(document, line);
        if (!isFunc) return undefined;

        return wrapper(isFunc.searchLine, isFunc.name);
    },

    getClass(document: vscode.TextDocument, textFix: string, line: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | undefined {
        const classDefReg = /^class\b\s\s*(\w\w*)/i;
        const classMatch = textFix.match(classDefReg);
        if (classMatch === null) return undefined;
        const Range = getRange(document, line, line, RangeEnd);
        const selectionRange = document.lineAt(line).range;
        const classSymbol = new vscode.DocumentSymbol(classMatch[1], '', vscode.SymbolKind.Class, Range, selectionRange);
        const fnList: funcLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getBlock, LineClass.getLine];
        classSymbol.children = getChildren(document, Range.start.line, Range.end.line, true, fnList);
        return Object.freeze(classSymbol);
    },

    getComment(document: vscode.TextDocument, textFix: string, line: number,
        RangeEnd: number, inClass: boolean): Readonly<vscode.DocumentSymbol> | undefined {
        const kind = vscode.SymbolKind.Package;
        const textRaw = document.lineAt(line).text;

        const Comments = textRaw.search(/^\s*{\s\s*;;/);
        if (Comments > -1) {
            const name = textRaw.substr(textRaw.indexOf(';;') + 2).trimEnd();
            const Range = getRange(document, line, line, RangeEnd);
            const selectionRange = document.lineAt(line).range;
            const CommentBlock = new vscode.DocumentSymbol(name, '', kind, Range, selectionRange);
            const fnList: funcLimit[] = [Core.getClass, Core.getFunc, Core.getComment, Core.getBlock, LineClass.getLine];
            CommentBlock.children = getChildren(document, Range.start.line, Range.end.line, inClass, fnList);
            return Object.freeze(CommentBlock);
        }

        const CommentLine = textRaw.search(/^\s*;;/);
        if (CommentLine > -1) {
            const name = textRaw.substr(CommentLine + 2).trimEnd();
            const Range = new vscode.Range(new vscode.Position(line, CommentLine), new vscode.Position(line, textRaw.length));
            return Object.freeze(new vscode.DocumentSymbol(name, '', kind, Range, Range));
        }
        return undefined;
    },
};
