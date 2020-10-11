/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { getFuncDef } from '../tools/getFuncDef';
import { getRange } from '../tools/getRange';
import { getRangeCaseBlock } from '../tools/getRangeCaseBlock';
import { MyDocSymbol } from '../globalEnum';
import { getCaseDefaultName, getSwitchName } from './getSwitchCaseName';
import { getRangeOfLine } from '../tools/getRangeOfLine';
import { getChildren, FuncInputType } from './getChildren';
// // import * as Oniguruma from 'vscode-oniguruma';

function getReturnByLine(FuncInput: FuncInputType): false | MyDocSymbol {
    const regex = (/\breturn\b\s\s*(.+)/i);
    if (regex.test(FuncInput.lStr) === false) return false;

    const line = FuncInput.line;
    const textRaw = FuncInput.DocStrMap[FuncInput.line].textRaw;
    const ReturnMatch = regex.exec(textRaw);
    if (ReturnMatch === null) return false;

    let name = ReturnMatch[1].trim();
    {
        const Func = (/^(\w\w*)\(/).exec(name);
        if (Func) {
            name = `${Func[1]}(...)`;
        } else {
            const obj = (/^(\{\s*\w\w*\s*:)/).exec(name);
            if (obj) name = `ahkObject ${obj[1]}`;
        }

        if (name.length > 20) name = `${name.substring(0, 20)}...`;
    }

    const rangeRaw = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, textRaw.length));
    return new vscode.DocumentSymbol(`Return ${name.trim()}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw);
}

const LineRuler = {
    matchList: [
        /^\s*static\s\s*(\w\w*)/i,
        /^\s*GoSub[\s,][\s,]*(\w\w*)/i,
        /^\s*GoTo[\s,][\s,]*(\w\w*)/i,
        /^\s*(\w\w*:)$/, // Label:
        /^\s*(\w\w*)\s*:=\s*\bnew\b/i, // objName := new className
        /^\s*(:[^:]*?:[^:][^:]*::)/, // HotStr
        /^\s*([^:][^:]*?::)/, // HotKeys
        /^\s*#(\w\w*)/, // directive
        /^\s*global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^\s*throw[\s,][\s,]*(.+)/i, // throw
        /^\s*(exit\b[\s,][\s,]*.*)/i, // exit
        /^\s*exitApp\b[\s,][\s,]*(.+)/i,
        /^\s*pause\b[\s,][\s,]*(.+)/i,
        /^\s*\b(reload)\b/i,
    ] as const,

    nameList: [
        '',
        'GoSub ',
        'GoTo ',
        '',
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
    ] as const,

    detailList: [
        'static',
        '',
        '',
        'Label ',
        'new obj', // new
        'HotStr', // HotStr
        'HotKeys', // HotKeys
        'directive', // directive
        'global', // global
        'command',
        'command',
        'command',
        'command',
        'command', // reload
    ] as const,

    kindList: [
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
    ] as const,
} as const;

export function ParserLine(FuncInput: FuncInputType): false | MyDocSymbol {
    if (FuncInput.lStr.trim() === '') return false;
    const ReturnValue = getReturnByLine(FuncInput);
    if (ReturnValue) return ReturnValue;

    const { DocStrMap, line, lStr } = FuncInput;

    const iMax = LineRuler.matchList.length;
    for (let i = 0; i < iMax; i++) {
        const oneLineSymbol = LineRuler.matchList[i].exec(lStr);
        if (oneLineSymbol !== null) {
            const rangeRaw = getRangeOfLine(DocStrMap, line);
            const name = `${LineRuler.nameList[i]}${oneLineSymbol[1].trim()}`;
            return new vscode.DocumentSymbol(name,
                LineRuler.detailList[i], LineRuler.kindList[i], rangeRaw, rangeRaw);
        }
    }
    return false;
}

export const ParserBlock = {
    getCaseDefaultBlock(FuncInput: FuncInputType): false | MyDocSymbol {
        if (FuncInput.lStr.trim() === '') return false;

        const {
            Uri, DocStrMap, line, RangeEndLine, inClass, lStr,
        } = FuncInput;

        const caseName = getCaseDefaultName(FuncInput.DocStrMap[FuncInput.line].textRaw, lStr);
        if (caseName === false) return false;

        const Range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const selectionRange = Range;
        const Block: MyDocSymbol = new vscode.DocumentSymbol(caseName,
            '', vscode.SymbolKind.EnumMember, Range, selectionRange);
        Block.children = getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass,
            fnList: [ParserBlock.getSwitchBlock, ParserBlock.getComment, ParserLine],
        });
        return Block;
    },

    getSwitchBlock(FuncInput: FuncInputType): false | MyDocSymbol {
        if (FuncInput.lStr.trim() === '') return false;

        if ((/^\s*\bswitch\b/i).test(FuncInput.lStr) === false) return false;

        const {
            Uri, DocStrMap, line, RangeEndLine, inClass,
        } = FuncInput;

        const textRaw = FuncInput.DocStrMap[FuncInput.line].textRaw;
        const Range = getRange(DocStrMap, line, line, RangeEndLine);
        const selectionRange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, textRaw.length));
        const SwitchBlock: MyDocSymbol = new vscode.DocumentSymbol(`Switch ${getSwitchName(textRaw)}`,
            '', vscode.SymbolKind.Enum, Range, selectionRange);
        SwitchBlock.children = getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass,
            fnList: [ParserBlock.getCaseDefaultBlock],
        });
        return SwitchBlock;
    },

    getFunc(FuncInput: FuncInputType): false | MyDocSymbol {
        const {
            Uri, DocStrMap, line, RangeEndLine, inClass,
        } = FuncInput;
        const isFunc = getFuncDef(DocStrMap, line);
        if (isFunc === false) return false;

        const getDetail = (): string => {
            if (line === 0) return '';
            const PreviousLineText = DocStrMap[line - 1].lStr.trimStart();
            return PreviousLineText.startsWith(';@')
                ? PreviousLineText.substring(2) // 2=== ';@'.len
                : '';
        };

        const searchLine = isFunc.selectionRange.end.line;
        const Range = getRange(DocStrMap, line, searchLine, RangeEndLine);
        const kind = inClass ? vscode.SymbolKind.Method : vscode.SymbolKind.Function;
        const detail = getDetail();

        const funcSymbol: MyDocSymbol = new vscode.DocumentSymbol(isFunc.name, detail, kind, Range, isFunc.selectionRange);
        funcSymbol.children = getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass,
            fnList: [ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, ParserLine],
        });
        return funcSymbol;
    },

    getClass(FuncInput: FuncInputType): false | MyDocSymbol {
        if (FuncInput.lStr.trim() === '') return false;
        const classExec = (/^\s*class\b\s\s*(\w\w*)/i).exec(FuncInput.lStr);
        if (classExec === null) return false;

        const {
            Uri, DocStrMap, line, RangeEndLine,
        } = FuncInput;
        const Range = getRange(DocStrMap, line, line, RangeEndLine);
        const selectionRange = getRangeOfLine(DocStrMap, line);
        const classSymbol: MyDocSymbol = new vscode.DocumentSymbol(classExec[1],
            '', vscode.SymbolKind.Class, Range, selectionRange);
        classSymbol.children = getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass: true,
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, ParserLine],
        });
        return classSymbol;
    },

    getComment(FuncInput: FuncInputType): false | MyDocSymbol {
        const {
            Uri, DocStrMap, line, RangeEndLine, inClass,
        } = FuncInput;
        const kind = vscode.SymbolKind.Package;

        const textRaw = FuncInput.DocStrMap[FuncInput.line].textRaw;
        const Comments = (/^\s*{\s\s*;;/).test(textRaw);
        if (Comments) {
            const getName: string = ((): string => {
                if (line - 1 >= 0) {
                    const previousLine = textRaw.trim();
                    const Exec: string[] = (/^(\w\w*)/).exec(previousLine) || [''];
                    const nameKind = Exec[0];
                    return nameKind;
                }
                return '';
            })();

            const name = getName + textRaw.substring(textRaw.indexOf(';;') + 2).trimEnd();
            const Range = getRange(DocStrMap, line, line, RangeEndLine);
            const selectionRange = new vscode.Range(
                new vscode.Position(line, 0),
                new vscode.Position(line, textRaw.length),
            );
            const CommentBlock: MyDocSymbol = new vscode.DocumentSymbol(name, '', kind, Range, selectionRange);
            CommentBlock.children = getChildren({
                Uri,
                DocStrMap,
                RangeStartLine: Range.start.line + 1,
                RangeEndLine: Range.end.line,
                inClass,
                fnList: [ParserBlock.getComment, ParserBlock.getSwitchBlock, ParserLine],
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
