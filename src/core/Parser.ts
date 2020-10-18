/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { getFuncDef } from '../tools/getFuncDef';
import { getRange } from '../tools/getRange';
import { getRangeCaseBlock } from '../tools/getRangeCaseBlock';
import { MyDocSymbol, DeepReadonly } from '../globalEnum';
import { getCaseDefaultName, getSwitchName } from './getSwitchCaseName';
import { getRangeOfLine } from '../tools/getRangeOfLine';
import { getChildren, FuncInputType } from './getChildren';
// // import * as Oniguruma from 'vscode-oniguruma';

export function getReturnByLine(FuncInput: FuncInputType): false | MyDocSymbol {
    const regex = (/\breturn\b\s\s*(.+)/i);
    if (regex.test(FuncInput.lStr) === false) return false;

    const line = FuncInput.line;
    const textRaw = FuncInput.DocStrMap[FuncInput.line].textRaw;
    const ReturnMatch = regex.exec(textRaw);
    if (ReturnMatch === null) return false;

    let name = ReturnMatch[1];
    {
        const Func = (/^\s*(\w\w*)\(/).exec(name);
        if (Func) {
            name = `${Func[1]}(...)`;
        } else {
            const obj = (/^\s*(\{\s*\w\w*\s*:)/).exec(name);
            if (obj) name = `Obj ${obj[1]}`;
        }

        if (name.length > 20) name = `${name.substring(0, 20)}...`;
    }

    const rangeRaw = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, textRaw.length));
    return new vscode.DocumentSymbol(`Return ${name.trim()}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw);
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type LineRulerType = DeepReadonly<{
    detail: string,
    name: string,
    kind: vscode.SymbolKind,
    regex: RegExp,
}[]>;

export function ParserLine(FuncInput: FuncInputType): false | MyDocSymbol {
    const { DocStrMap, line, lStr } = FuncInput;
    if (lStr === '' || (/^\s*$/).test(lStr)) return false;

    const LineRuler: LineRulerType = [
        {
            regex: /^\s*#(\w\w*)/, // #
            name: '#',
            detail: 'directive',
            kind: vscode.SymbolKind.Event,
        },
        {
            regex: /^\s*\bglobal\b[\s,][\s,]*(\w[^:=]*)/i, // global
            name: '',
            detail: 'global',
            kind: vscode.SymbolKind.Variable,
        },
        {
            regex: /^\s*\bstatic\b[\s,][\s,]*(\w[^:=]*)/i, // static
            name: '',
            detail: 'static',
            kind: vscode.SymbolKind.Variable,
        },
        {
            regex: /^\s*\bthrow\b[\s,][\s,]*(.+)/i, // throw
            name: 'throw ',
            detail: 'throw',
            kind: vscode.SymbolKind.Event,
        },
        {
            regex: /^\s*(\w\w*:)\s*$/, // Label:
            name: '',
            detail: 'label',
            kind: vscode.SymbolKind.Package,
        },
        {
            regex: /^\s*(:[^:]*?:[^:][^:]*::)/, // HotStr
            name: '',
            detail: 'HotStr',
            kind: vscode.SymbolKind.Event,
        },
        {
            regex: /^\s*([^:][^:]*?::)/, // HotKeys
            name: '',
            detail: 'HotKeys',
            kind: vscode.SymbolKind.Event,
        },
    ];
    const LineRulerLen = LineRuler.length;
    for (let i = 0; i < LineRulerLen; i++) {
        const oneLineSymbol = LineRuler[i].regex.exec(lStr); // TODO .test -> exec
        if (oneLineSymbol !== null) {
            const rangeRaw = getRangeOfLine(DocStrMap, line);
            const name = `${LineRuler[i].name}${oneLineSymbol[1].trim()}`;
            return new vscode.DocumentSymbol(name,
                LineRuler[i].detail, LineRuler[i].kind, rangeRaw, rangeRaw);
        }
    }
    return false;
}

export const ParserBlock = {
    getCaseDefaultBlock(FuncInput: FuncInputType): false | MyDocSymbol {
        const { lStr } = FuncInput;
        if (lStr === '' || (/^\s*$/).test(lStr)) return false;

        const caseName = getCaseDefaultName(FuncInput.DocStrMap[FuncInput.line].textRaw, FuncInput.lStr);
        if (caseName === false) return false;
        const {
            Uri, DocStrMap, line, RangeEndLine, inClass,
        } = FuncInput;

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
            fnList: [ParserBlock.getSwitchBlock, ParserBlock.getComment, getReturnByLine, ParserLine],
        });
        return Block;
    },

    getSwitchBlock(FuncInput: FuncInputType): false | MyDocSymbol {
        if ((/^\s*\bswitch\b/i).test(FuncInput.lStr) === false) return false;

        const {
            Uri, DocStrMap, line, RangeEndLine, inClass, lStr,
        } = FuncInput;

        const Range = getRange(DocStrMap, line, line, RangeEndLine);
        const selectionRange = getRangeOfLine(DocStrMap, line);
        const SwitchBlock: MyDocSymbol = new vscode.DocumentSymbol(`Switch ${getSwitchName(lStr)}`,
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
            Uri, DocStrMap, line, RangeEndLine, inClass, lStr,
        } = FuncInput;

        if (lStr === '' || (/^\s*$/).test(lStr)) return false;
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
            fnList: [ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
        });
        return funcSymbol;
    },

    getClass(FuncInput: FuncInputType): false | MyDocSymbol {
        if ((/^\s*\bclass\b/i).test(FuncInput.lStr) === false) return false;

        const classExec = (/^\s*\bclass\b\s\s*(\w\w*)/i).exec(FuncInput.lStr);
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
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
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
                    const nameKind: string[] = (/^\s*(\w\w*)/).exec(FuncInput.DocStrMap[FuncInput.line - 1].textRaw) || [''];
                    return nameKind[0];
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
                fnList: [ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
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
