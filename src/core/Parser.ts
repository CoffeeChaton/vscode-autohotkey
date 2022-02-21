/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */
import * as vscode from 'vscode';
import { TAhkSymbol } from '../globalEnum';
import { getClassDetail } from '../tools/ahkClass/getClassDetail';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getFuncDef } from '../tools/Func/getFuncDef';
import { getRange } from '../tools/getRange';
import { getRangeCaseBlock } from '../tools/getRangeCaseBlock';
import { getRangeOfLine } from '../tools/getRangeOfLine';
import { FuncInputType, getChildren } from './getChildren';
import { getCaseDefaultName, getSwitchName } from './getSwitchCaseName';
import { ParserLine } from './ParserLine';

function getReturnName(textRaw: string): string | null {
    const ReturnMatch = (/\breturn\b\s+(.+)/iu).exec(textRaw);
    if (ReturnMatch === null) return null;

    let name = ReturnMatch[1].trim();
    if (ReturnMatch) {
        const Func = (/^(\w+)\(/u).exec(name);
        if (Func) return `${Func[1]}(...)`; //

        // if (name.indexOf('{') > -1 && name.indexOf(':') > -1) {
        //     const obj = (/^\s*(\{\s*\w+\s*:)/u).exec(name); // ex Array := {KeyA: ValueA, KeyB: ValueB, ..., KeyZ: ValueZ}
        //     if (obj) name = `Obj ${obj[1]}`;
        // }

        if (name.length > 20) name = `${name.substring(0, 20)}...`;
    }
    return name;
}

export function getReturnByLine(FuncInput: FuncInputType): false | TAhkSymbol {
    // if (!(/\breturn\b/iu).test(FuncInput.lStr)) return false;
    if (!(/\s\breturn\b\s+\S/iu).test(FuncInput.lStr)) return false;
    const { line } = FuncInput;
    const { textRaw } = FuncInput.DocStrMap[FuncInput.line];
    const name = getReturnName(textRaw);
    if (!name) return false;
    const rangeRaw = new vscode.Range(line, 0, line, textRaw.length); // FIXME: startCharacter err, is not 0
    return new vscode.DocumentSymbol(`Return ${name}`, '', vscode.SymbolKind.Variable, rangeRaw, rangeRaw);
}

export const ParserBlock = {
    getCaseDefaultBlock(FuncInput: FuncInputType): false | TAhkSymbol {
        const { lStr } = FuncInput;
        if (lStr === '' || lStr.indexOf(':') === -1) return false;
        const {
            gValMapBySelf,
            Uri,
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
            gValMapBySelf,
            Uri,
            DocStrMap,
            RangeStartLine: Range.start.line + 1,
            RangeEndLine: Range.end.line,
            inClass,
            fnList: [ParserBlock.getSwitchBlock, ParserBlock.getComment, getReturnByLine, ParserLine],
        });
        return Block;
    },

    getSwitchBlock(FuncInput: FuncInputType): false | TAhkSymbol {
        if (!(/^\s*\bswitch\b/ui).test(FuncInput.lStr)) return false;

        const {
            gValMapBySelf,
            Uri,
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
            gValMapBySelf,
            Uri,
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
            gValMapBySelf,
            Uri,
            DocStrMap,
            line,
            RangeEndLine,
            inClass,
            lStr,
        } = FuncInput;

        if (lStr.length < 1 || lStr.indexOf('(') === -1) return false;
        const isFunc = getFuncDef(DocStrMap, line);
        if (isFunc === false) return false;
        const { name, selectionRange } = isFunc;
        const getDetail = (): string => {
            if (line === 0) return '';
            const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
            return PreviousLineText.startsWith(';@')
                ? PreviousLineText.substring(2) // 2=== ';@'.len
                : '';
        };

        const searchLine = selectionRange.end.line;
        const range = getRange(DocStrMap, line, searchLine, RangeEndLine);
        const kind = inClass
            ? vscode.SymbolKind.Method
            : vscode.SymbolKind.Function;
        const detail = getDetail();

        const funcSymbol: TAhkSymbol = new vscode.DocumentSymbol(name, detail, kind, range, selectionRange);
        funcSymbol.children = getChildren({
            gValMapBySelf,
            Uri,
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            inClass,
            fnList: [
                ParserBlock.getFunc,
                ParserBlock.getComment,
                ParserBlock.getSwitchBlock,
                getReturnByLine,
                ParserLine,
            ],
        });
        return funcSymbol;
    },

    getClass(FuncInput: FuncInputType): false | TAhkSymbol {
        if (!(/^\s*\bclass\b/ui).test(FuncInput.lStr)) return false;

        const classExec = (/^\s*\bclass\b\s+(\w+)/ui).exec(FuncInput.lStr);
        if (classExec === null) return false;

        const {
            gValMapBySelf,
            Uri,
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
            gValMapBySelf,
            Uri,
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
        if (textRaw.indexOf(';;') === -1) return false;
        const kind = vscode.SymbolKind.Package;
        const {
            gValMapBySelf,
            Uri,
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
        if (textRaw.indexOf('{') >= textRaw.indexOf(';;')) return false;
        const Comments = (/^\s*\{\s;;/u).test(textRaw);
        if (!Comments) return false;

        const getName = (): string => {
            if (line - 1 >= 0) {
                const nameKind: string[] = (/^\s*(\w+)/u)
                    .exec(FuncInput.DocStrMap[FuncInput.line - 1].textRaw) ?? [''];
                return nameKind[0].trim();
            }
            return '';
        };

        const range = getRange(DocStrMap, line, line, RangeEndLine);
        const name = getName() + textRaw.substring(textRaw.indexOf(';;') + 2).trimEnd();
        const selectionRange = new vscode.Range(line, 0, line, textRaw.length);
        const CommentBlock: TAhkSymbol = new vscode.DocumentSymbol(
            name,
            '',
            vscode.SymbolKind.Package,
            range,
            selectionRange,
        );
        CommentBlock.children = getChildren({
            gValMapBySelf,
            Uri,
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            inClass,
            fnList: [ParserBlock.getComment, ParserBlock.getSwitchBlock, getReturnByLine, ParserLine],
        });
        return CommentBlock;
    },
} as const;
