/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable security/detect-object-injection */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000,4,7] }] */
import * as vscode from 'vscode';
import { getFuncDef } from '../tools/getFuncDef';
import { getRange, getCaseBlockRange } from '../tools/getRange';
import { removeSpecialChar, removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import { inCommentBlock } from '../tools/inCommentBlock';
import { inLTrimRange } from '../tools/inLTrimRange';
// // import * as Oniguruma from 'vscode-oniguruma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

type FuncInputType = DeepReadonly<{
    document: vscode.TextDocument,
    textRaw: string,
    textFix: string,
    line: number,
    RangeEnd: number,
    inClass: boolean,
}>;

export type FuncLimit = (FuncInput: FuncInputType) => DeepReadonly<vscode.DocumentSymbol> | false;

export type ChildType = DeepReadonly<{
    document: vscode.TextDocument,
    RangeStart: number,
    RangeEnd: number,
    inClass: boolean,
    fnList: FuncLimit[]
}>;

export function getChildren(child: ChildType): DeepReadonly<vscode.DocumentSymbol>[] {
    const {
        document, RangeStart, RangeEnd, inClass, fnList,
    } = child;

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
        if (getSkipSign(textFix)) continue;

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) continue;

        for (let i = 0; i < iMax; i += 1) {
            const DocumentSymbol: DeepReadonly<vscode.DocumentSymbol> | false = fnList[i]({
                document, textFix, line, RangeEnd, inClass, textRaw,
            });
            if (DocumentSymbol !== false) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line;
                continue;
            }
        }
    }
    return result;
}

type LineClassI = Readonly<{
    matchListOne: RegExp[];
    nameListOne: string[];
    kindListOne: vscode.SymbolKind[];
    getReturnByLine(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false;
    getLine(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false;
}>;

export const LineClass: LineClassI = {
    matchListOne: [
        /^\s*static\s\s*(\w\w*)/i,
        /^\s*GoSub[\s,][\s,]*(\w\w*)/i,
        /^\s*GoTo[\s,][\s,]*(\w\w*)/i,
        /^\s*(\w\w*):$/, // Label:
        /^\s*(\w\w*)\s*:=\s*\bnew\b/i, // objName := new className
        /^\s*:[^:]*?:([^:][^:]*)::/, // HotStr
        /^\s*([^:][^:]*?)::/, // HotKeys
        /^\s*#(\w\w*)/, // directive
        /^\s*global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^\s*throw[\s,][\s,]*(.+)/i, // throw
        /^\s*(exit\b[\s,][\s,]*.*)/i, // exit
        /^\s*exitApp\b[\s,][\s,]*(.+)/i,
        /^\s*pause\b[\s,][\s,]*(.+)/i,
        /^\s*(reload)\b/i,
    ],

    nameListOne: [
        'Static ',
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
    ],

    kindListOne: [
        // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
        vscode.SymbolKind.Variable, // Static
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
    ],

    getReturnByLine(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const { document, textRaw, line } = FuncInput;
        const textFixNot2 = removeSpecialChar(textRaw).trim();
        const ReturnMatch = (/\breturn\b[\s,][\s,]*(.+)/i).exec(textFixNot2);
        if (ReturnMatch === null) return false;

        let name = ReturnMatch[1].trim();
        const Func = (/^(\w\w*)\(/).exec(name);
        if (Func) {
            name = `${Func[1]}(...)`;
        } else {
            const obj = (/^(\{\s*\w\w*\s*:)/).exec(name);
            if (obj) name = `ahkObject ${obj[1]}`;
        }
        const rangeRaw = document.lineAt(line).range;
        return new vscode.DocumentSymbol(`Return ${name.trim()}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw);
    },

    getLine(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, line, textFix,
        } = FuncInput;

        if (textFix === '') return false;
        const ReturnValue = LineClass.getReturnByLine(FuncInput);
        if (ReturnValue) return ReturnValue;

        const iMax = LineClass.matchListOne.length;
        for (let i = 0; i < iMax; i += 1) {
            const oneLineSymbol = LineClass.matchListOne[i].exec(textFix);
            if (oneLineSymbol) {
                const rangeRaw = document.lineAt(line).range;
                const name = `${LineClass.nameListOne[i]}${oneLineSymbol[1].trim()}`;
                return new vscode.DocumentSymbol(name,
                    '', LineClass.kindListOne[i], rangeRaw, rangeRaw);
            }
        }
        return false;
    },
};

export const Core = {

    // matchList: [
    //     // /^loop[\s,%][\s,%]*(\w\w\w\w*)/i,
    //     // /^for\b[\s,\w]+in\s\s*(\w\w\w\w*)/i,
    // ],

    // nameList: [
    //     // 'Loop ',
    //     // 'For ',
    // ],

    // kindList: [
    //     // vscode.SymbolKind.Package,
    //     // vscode.SymbolKind.Package,
    // ],

    getCaseDefaultBlock(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, textFix, line, RangeEnd, inClass, textRaw,
        } = FuncInput;
        if (textFix === '') return false;

        const isCaseDefaultBlock = (): string | false => {
            const isCase = textRaw.search(/^\s*case\s/i);
            const isDefault = textRaw.search(/^\s*default\s*:/i);
            if (isCase === -1 && isDefault === -1) return false;

            const caseValueEnd = removeSpecialChar(textRaw).search(/:\s*$/);
            if (caseValueEnd === -1) return false;
            if (isCase > -1) {
                const tempStr = removeSpecialChar(textRaw).replace(/case/i, '').replace(/:\s*$/, '').trim();
                return `Case ${tempStr}:`;
            }
            if (isDefault > -1) return 'Default :';
            return false;
        };

        const caseName = isCaseDefaultBlock();
        if (caseName === false) return false;

        const Range = getCaseBlockRange(document, line, line, RangeEnd);
        const selectionRange = Range;
        const Block: DeepReadonly<vscode.DocumentSymbol> = new vscode.DocumentSymbol(caseName,
            '', vscode.SymbolKind.EnumMember, Range, selectionRange);
        Block.children = getChildren({
            document,
            RangeStart: Range.start.line,
            RangeEnd: Range.end.line,
            inClass,
            fnList: [Core.getSwitchBlock, Core.getComment, LineClass.getLine],
        });
        return Block;
    },

    getSwitchBlock(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, textFix, line, RangeEnd, inClass,
        } = FuncInput;
        if (textFix === '') return false;

        const SwitchBlockName: RegExpExecArray | null = (/^switch\s\s*(\S\S*)\{?/i).exec(textFix);
        if (SwitchBlockName === null) return false;

        const Range = getRange(document, line, line, RangeEnd);
        const selectionRange = document.lineAt(line).range;
        const SwitchBlock: DeepReadonly<vscode.DocumentSymbol> = new vscode.DocumentSymbol(`Switch ${SwitchBlockName[1]}`,
            '', vscode.SymbolKind.Enum, Range, selectionRange);
        SwitchBlock.children = getChildren({
            document,
            RangeStart: Range.start.line,
            RangeEnd: Range.end.line,
            inClass,
            fnList: [Core.getCaseDefaultBlock],
        });
        return SwitchBlock;
    },

    getFunc(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, line, RangeEnd, inClass,
        } = FuncInput;
        const isFunc = getFuncDef(document, line);
        if (isFunc === false) return false;

        const wrapper = (searchLine: number, name: string): DeepReadonly<vscode.DocumentSymbol> => {
            const getDetail = (): string => {
                if (line === 0) return '';
                const PreviousLineText = document.lineAt(line - 1).text.trim();
                if (PreviousLineText.startsWith(';@')) return PreviousLineText.substring(2);// 2=== ';@'.len
                return '';
            };
            const Range = getRange(document, line, searchLine, RangeEnd);
            const kind = inClass ? vscode.SymbolKind.Method : vscode.SymbolKind.Function;
            const detail = getDetail();
            const selectionRange = new vscode.Range(
                new vscode.Position(line, 0),
                document.lineAt(searchLine).range.end,
            );
            const funcSymbol: DeepReadonly<vscode.DocumentSymbol> = new vscode.DocumentSymbol(name, detail, kind, Range, selectionRange);
            funcSymbol.children = getChildren({
                document,
                RangeStart: Range.start.line,
                RangeEnd: Range.end.line,
                inClass,
                fnList: [Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine],
            });
            return funcSymbol;
        };
        return wrapper(isFunc.searchLine, isFunc.name);
    },

    getClass(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, textFix, line, RangeEnd,
        } = FuncInput;
        if (textFix === '') return false;
        const classExec = (/^class\b\s\s*(\w\w*)/i).exec(textFix);
        if (classExec === null) return false;
        const Range = getRange(document, line, line, RangeEnd);
        const selectionRange = document.lineAt(line).range;
        const classSymbol: DeepReadonly<vscode.DocumentSymbol> = new vscode.DocumentSymbol(classExec[1],
            '', vscode.SymbolKind.Class, Range, selectionRange);
        classSymbol.children = getChildren({
            document,
            RangeStart: Range.start.line,
            RangeEnd: Range.end.line,
            inClass: true,
            fnList: [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine],
        });
        return classSymbol;
    },

    getComment(FuncInput: FuncInputType): DeepReadonly<vscode.DocumentSymbol> | false {
        const {
            document, line, RangeEnd, inClass,
        } = FuncInput;
        const kind = vscode.SymbolKind.Package;
        const textRaw = document.lineAt(line).text;
        const Comments = (/^\s*{\s\s*;;/).test(textRaw);
        if (Comments) {
            const getName: string = ((): string => {
                if (line - 1 >= 0) {
                    const previousLine = document.lineAt(line - 1).text.trim();
                    const Exec: string[] = (/^([\w][\w]*)/).exec(previousLine) || [''];
                    const nameKind = Exec[0];
                    return nameKind;
                }
                return '';
            })();

            const name = getName + textRaw.substring(textRaw.indexOf(';;') + 2).trimEnd();
            const Range = getRange(document, line, line, RangeEnd);
            const selectionRange = document.lineAt(line).range;
            const CommentBlock: DeepReadonly<vscode.DocumentSymbol> = new vscode.DocumentSymbol(name, '', kind, Range, selectionRange);
            CommentBlock.children = getChildren({
                document,
                RangeStart: Range.start.line,
                RangeEnd: Range.end.line,
                inClass,
                fnList: [Core.getClass, Core.getFunc, Core.getComment, Core.getSwitchBlock, LineClass.getLine],
            });
            return CommentBlock;
        }

        const CommentLine = textRaw.search(/^\s*;;/);
        if (CommentLine > -1) {
            const name = textRaw.substring(CommentLine + 2).trimEnd();
            const Range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, textRaw.length));
            return new vscode.DocumentSymbol(name, '', kind, Range, Range);
        }
        return false;
    },
} as const;
