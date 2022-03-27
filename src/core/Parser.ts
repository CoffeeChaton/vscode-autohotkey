/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { TAhkSymbol, TTokenStream } from '../globalEnum';
import { getCaseDefaultName, getSwitchName } from '../provider/SymbolProvider/getSwitchCaseName';
import { getClassDetail } from '../tools/ahkClass/getClassDetail';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getFuncDef } from '../tools/Func/getFuncDef';
import { getRange } from '../tools/range/getRange';
import { getRangeCaseBlock } from '../tools/range/getRangeCaseBlock';
import { getRangeOfLine } from '../tools/range/getRangeOfLine';
import { FuncInputType, getChildren } from './getChildren';
import { ParserLine } from './ParserTools/ParserLine';

function getFuncDetail(line: number, DocStrMap: TTokenStream): string {
    if (line === 0) return '';
    const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
    return PreviousLineText.startsWith(';@')
        ? PreviousLineText.substring(2) // 2=== ';@'.len
        : '';
}

export const ParserBlock = {
    getCaseDefaultBlock(FuncInput: FuncInputType): false | TAhkSymbol {
        const { lStr } = FuncInput;
        if (lStr === '' || lStr.indexOf(':') === -1) return false;
        const {
            RangeEndLine,
            inClass,
            line,
            DocStrMap,
        } = FuncInput;

        const caseName = getCaseDefaultName(DocStrMap[line].textRaw, lStr);
        if (caseName === false) return false;

        const Range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const Block: TAhkSymbol = new vscode.DocumentSymbol(
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
            inClass,
            fnList: [ParserBlock.getSwitchBlock, ParserBlock.getComment, ParserLine],
        });
        return Block;
    },

    getSwitchBlock(FuncInput: FuncInputType): false | TAhkSymbol {
        if (!(/^SWITCH$/ui).test(FuncInput.fistWord)) return false;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            inClass,
            lStr,
        } = FuncInput;

        const range = getRange(DocStrMap, line, line, RangeEndLine);
        const selectionRange = getRangeOfLine(DocStrMap, line);
        const SwitchBlock: TAhkSymbol = new vscode.DocumentSymbol(
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
            inClass,
            fnList: [ParserBlock.getCaseDefaultBlock],
        });
        return SwitchBlock;
    },

    getFunc(FuncInput: FuncInputType): false | TAhkSymbol {
        const {
            DocStrMap,
            line,
            RangeEndLine,
            inClass,
            lStr,
        } = FuncInput;

        if (lStr.length < 1 || lStr.indexOf('(') === -1 || lStr.indexOf('}') > -1) return false;
        const isFunc = getFuncDef(DocStrMap, line);
        if (isFunc === false) return false;
        const { name, selectionRange } = isFunc;

        const searchLine = selectionRange.end.line;
        const range = getRange(DocStrMap, line, searchLine, RangeEndLine);
        const kind = inClass
            ? vscode.SymbolKind.Method
            : vscode.SymbolKind.Function;
        const detail = getFuncDetail(line, DocStrMap);

        const funcSymbol: TAhkSymbol = new vscode.DocumentSymbol(name, detail, kind, range, selectionRange);
        funcSymbol.children = getChildren({
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            inClass,
            fnList: [
                ParserBlock.getFunc,
                ParserBlock.getComment,
                ParserBlock.getSwitchBlock,
                ParserLine,
            ],
        });
        return funcSymbol;
    },

    getClass(FuncInput: FuncInputType): false | TAhkSymbol {
        if (!(/^CLASS$/ui).test(FuncInput.fistWord)) return false;

        const classExec = (/^\s*\bclass\b\s+(\w+)/ui).exec(FuncInput.lStr);
        if (classExec === null) return false;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            lStr,
        } = FuncInput;
        const Range = getRange(DocStrMap, line, line, RangeEndLine);

        const name = classExec[1];

        const col = lStr.indexOf(name);
        const colFix = col === -1
            ? lStr.length
            : col;
        const selectionRange = new vscode.Range(line, colFix, line, colFix + name.length);
        const detail = getClassDetail(lStr, colFix, name);
        const classSymbol: TAhkSymbol = new vscode.DocumentSymbol(
            name,
            detail,
            vscode.SymbolKind.Class,
            Range,
            selectionRange,
        );
        classSymbol.children = getChildren({
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass: true,
            fnList: [ParserBlock.getClass, ParserBlock.getFunc, getClassGetSet, ParserLine, getClassInstanceVar],
        });
        return classSymbol;
    },

    getComment(FuncInput: FuncInputType): false | TAhkSymbol {
        const { textRaw } = FuncInput.DocStrMap[FuncInput.line];
        const doubleSemicolon = textRaw.indexOf(';;');
        if (doubleSemicolon === -1) return false;
        const kind = vscode.SymbolKind.Package;
        const {
            DocStrMap,
            line,
            RangeEndLine,
            inClass,
        } = FuncInput;
        // ;;
        const CommentLine = textRaw.search(/^\s*;;/u);
        if (CommentLine > -1) {
            const name = textRaw.substring(CommentLine + 2).trimEnd();
            const Range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, textRaw.length));
            return new vscode.DocumentSymbol(name, '', kind, Range, Range);
        }

        // { ;;
        if (textRaw.indexOf('{') >= doubleSemicolon) return false;
        const Comments = (/^\s*\{\s+;;/u).test(textRaw);
        if (!Comments) return false;

        const range = getRange(DocStrMap, line, line, RangeEndLine);
        const name = textRaw.substring(doubleSemicolon + 2).trimEnd();
        const selectionRange = new vscode.Range(line, 0, line, textRaw.length);
        const CommentBlock: TAhkSymbol = new vscode.DocumentSymbol(
            name,
            '',
            vscode.SymbolKind.Package,
            range,
            selectionRange,
        );

        CommentBlock.children = getChildren({
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            inClass,
            fnList: [ParserBlock.getComment, ParserBlock.getSwitchBlock, ParserLine],
        });
        return CommentBlock;
    },
} as const;
