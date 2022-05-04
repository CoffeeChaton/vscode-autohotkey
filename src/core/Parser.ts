/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { CAhkClass } from '../CAhkClass';
import { CAhkFunc } from '../CAhkFunc';
import { getCaseDefaultName, getSwitchName } from '../provider/SymbolProvider/getSwitchCaseName';
import { TAhkSymbolIn, TAhkSymbolList } from '../TAhkSymbolIn';
import { getClassDetail } from '../tools/ahkClass/getClassDetail';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getFuncDef, TFuncDefData } from '../tools/Func/getFuncDef';
import { getRange } from '../tools/range/getRange';
import { getRangeCaseBlock } from '../tools/range/getRangeCaseBlock';
import { getRangeOfLine } from '../tools/range/getRangeOfLine';
import { replacerSpace } from '../tools/str/removeSpecialChar';
import { getChildren, TFuncInput } from './getChildren';
import { getFuncCore } from './ParserFunc';
import { ParserLine } from './ParserTools/ParserLine';
import { setClassInsertText } from './ParserTools/setClassInsertText';

export const ParserBlock = {
    getCaseDefaultBlock(FuncInput: TFuncInput): null | TAhkSymbolIn {
        const { lStr } = FuncInput;
        if (lStr === '' || lStr.indexOf(':') === -1) return null;
        const {
            RangeEndLine,
            classStack,
            line,
            DocStrMap,
            document,
            GValMap,
        } = FuncInput;

        const caseName: string | null = getCaseDefaultName(DocStrMap[line].textRaw, lStr);
        if (caseName === null) return null;

        const Range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const Block: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            caseName,
            '',
            vscode.SymbolKind.EnumMember,
            Range,
            Range,
        );
        Block.children = getChildren({
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            classStack,
            fnList: [ParserBlock.getSwitchBlock, ParserBlock.getComment, ParserLine],
            document,
            GValMap,
        }) as vscode.DocumentSymbol[];
        return Block;
    },

    getSwitchBlock(FuncInput: TFuncInput): null | TAhkSymbolIn {
        if (!(/^SWITCH$/ui).test(FuncInput.fistWordUp)) return null;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            classStack,
            lStr,
            document,
            GValMap,
        } = FuncInput;

        const range = getRange(DocStrMap, line, line, RangeEndLine);
        const selectionRange = getRangeOfLine(DocStrMap, line);
        const SwitchBlock: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            getSwitchName(lStr),
            'Switch',
            vscode.SymbolKind.Enum,
            range,
            selectionRange,
        );
        SwitchBlock.children = getChildren({
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            classStack,
            fnList: [ParserBlock.getCaseDefaultBlock],
            document,
            GValMap,
        }) as vscode.DocumentSymbol[];
        return SwitchBlock;
    },

    getFunc(FuncInput: TFuncInput): null | CAhkFunc {
        const {
            DocStrMap,
            line,
            RangeEndLine,
            classStack,
            lStr,
            document,
            GValMap,
        } = FuncInput;

        if (lStr.length < 1 || lStr.indexOf('(') === -1 || lStr.indexOf('}') > -1) return null;
        const isFunc: TFuncDefData | null = getFuncDef(DocStrMap, line);
        if (isFunc === null) return null;
        const { name, selectionRange } = isFunc;

        const range = getRange(DocStrMap, line, selectionRange.end.line, RangeEndLine);
        const children: vscode.DocumentSymbol[] = getChildren({
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            classStack,
            fnList: [
                ParserBlock.getComment,
                ParserBlock.getSwitchBlock,
                ParserLine,
            ],
            document,
            GValMap,
        }) as vscode.DocumentSymbol[];

        return getFuncCore({
            FuncInput,
            name,
            selectionRange,
            range,
            children,
        });
    },

    getClass(FuncInput: TFuncInput): null | CAhkClass {
        if (!(/^CLASS$/ui).test(FuncInput.fistWordUp)) return null;
        // class ClassName extends BaseClassName
        const ma: RegExpMatchArray | null = FuncInput.lStr.match(/(?<=^\s*\bClass\b\s+)(\w+)/ui);
        if (ma === null) return null;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            lStr,
            document,
            GValMap,
            classStack,
        } = FuncInput;

        const range = getRange(DocStrMap, line, line, RangeEndLine);
        const name = ma[1];

        const col = ma.index ?? lStr.replace(/^\s*Class\s+/ui, replacerSpace).indexOf(name);
        if (col === -1) {
            console.error('🚀 ~ getClass ~ ma', ma);
            return null;
        }

        const children: TAhkSymbolList = getChildren({
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            classStack: [...classStack, name],
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, getClassGetSet, ParserLine, getClassInstanceVar],
            document,
            GValMap,
        });

        const AhkClassSymbol: CAhkClass = new CAhkClass({
            name,
            detail: getClassDetail(lStr, col, name),
            range,
            selectionRange: new vscode.Range(line, col, line, col + name.length),
            insertText: `${name}${setClassInsertText(children)}`,
            uri: document.uri,
            children: children as vscode.DocumentSymbol[],
        });
        return AhkClassSymbol;
    },

    getComment(FuncInput: TFuncInput): null | TAhkSymbolIn {
        const {
            line,
            lStr,
            DocStrMap,
        } = FuncInput;
        if (lStr.trim().length !== 0) return null;
        const { textRaw } = DocStrMap[line];
        const doubleSemicolon = textRaw.indexOf(';;');
        if (doubleSemicolon === -1) return null;
        // ;;
        if ((/^\s*;;/u).test(textRaw)) {
            const name: string = textRaw.substring(doubleSemicolon + 2).trimEnd();
            const Range: vscode.Range = new vscode.Range(
                new vscode.Position(line, doubleSemicolon + 2),
                new vscode.Position(line, textRaw.length),
            );
            return new vscode.DocumentSymbol(name, '', vscode.SymbolKind.Package, Range, Range);
        }
        return null;
    },
} as const;
