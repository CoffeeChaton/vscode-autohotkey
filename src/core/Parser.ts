/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { CAhkCase, CAhkDefault, CAhkSwitch } from '../AhkSymbol/CAhkSwitch';
import { getCaseName, getSwitchName } from '../provider/SymbolProvider/getSwitchCaseName';
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
    getCaseBlock(FuncInput: TFuncInput): null | CAhkCase {
        const { lStr, fistWordUp } = FuncInput;

        if (fistWordUp !== 'CASE') return null;
        if (lStr.indexOf(':') === -1) return null;

        const {
            RangeEndLine,
            classStack,
            line,
            DocStrMap,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const name: string | null = getCaseName(DocStrMap[line].textRaw, lStr);
        if (name === null) return null;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkCase>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                classStack,
                document,
                GValMap,
            },
        );

        return new CAhkCase({
            name,
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },

    getDefaultBlock(FuncInput: TFuncInput): null | CAhkDefault {
        const { lStr, fistWordUp } = FuncInput;

        if (fistWordUp !== 'DEFAULT') return null;
        if (!(/^default\b\s*:/iu).test(lStr.trim())) return null;

        const {
            RangeEndLine,
            classStack,
            line,
            DocStrMap,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkDefault>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                classStack,
                document,
                GValMap,
            },
        );

        return new CAhkDefault({
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },

    getSwitchBlock(FuncInput: TFuncInput): null | CAhkSwitch {
        if (FuncInput.fistWordUp !== 'SWITCH') return null;

        const {
            DocStrMap,
            line,
            RangeEndLine,
            classStack,
            lStr,
            document,
            GValMap,
            textRaw,
        } = FuncInput;

        const range = getRange(DocStrMap, line, line, RangeEndLine);

        const ch = getChildren<CAhkSwitch>(
            [ParserBlock.getCaseBlock, ParserBlock.getDefaultBlock],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                classStack,
                document,
                GValMap,
            },
        );

        return new CAhkSwitch({
            name: `Switch ${getSwitchName(lStr)}`,
            range,
            selectionRange: getRangeOfLine(line, lStr, textRaw.length),
            uri: document.uri,
            ch,
        });
    },
} as const;

export function getFunc(FuncInput: TFuncInput): null | CAhkFunc {
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
    const ch = getChildren<CAhkFunc>(
        [ParserBlock.getSwitchBlock, ParserLine],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            classStack,
            document,
            GValMap,
        },
    );

    return getFuncCore({
        FuncInput,
        name,
        selectionRange,
        range,
        ch,
    });
}

export function getClass(FuncInput: TFuncInput): null | CAhkClass {
    if (FuncInput.fistWordUp !== 'CLASS') return null;
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

    const ch = getChildren<CAhkClass>(
        [getClass, getFunc, getClassGetSet, getClassInstanceVar],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            classStack: [...classStack, name],
            document,
            GValMap,
        },
    );

    const col = ma.index ?? lStr.replace(/^\s*Class\s+/ui, replacerSpace).indexOf(name);

    return new CAhkClass({
        name,
        detail: getClassDetail(lStr, col, name),
        range,
        selectionRange: new vscode.Range(line, col, line, col + name.length),
        insertText: `${name}${setClassInsertText(ch)}`,
        uri: document.uri,
        ch,
    });
}
