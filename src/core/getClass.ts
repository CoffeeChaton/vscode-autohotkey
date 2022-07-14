import * as vscode from 'vscode';
import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { getClassDetail } from '../tools/ahkClass/getClassDetail';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getRange } from '../tools/range/getRange';
import { replacerSpace } from '../tools/str/removeSpecialChar';
import { getChildren, TFuncInput } from './getChildren';
import { getFunc } from './ParserFunc';
import { setClassInsertText } from './ParserTools/setClassInsertText';

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
        defStack,
    } = FuncInput;

    const range = getRange(DocStrMap, line, line, RangeEndLine);
    const name = ma[1];

    const ch = getChildren<CAhkClass>(
        [getClass, getFunc, getClassGetSet, getClassInstanceVar],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack: [...defStack, name],
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
