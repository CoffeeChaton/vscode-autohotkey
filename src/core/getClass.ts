import * as vscode from 'vscode';
import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList } from '../AhkSymbol/TAhkSymbolIn';
import { getClassGetSet } from '../tools/ahkClass/getClassGetSet';
import { getClassInstanceVar } from '../tools/ahkClass/getClassInstanceVar';
import { getRange } from '../tools/range/getRange';
import { replacerSpace } from '../tools/str/removeSpecialChar';
import type { TFuncInput } from './getChildren';
import { getChildren } from './getChildren';
import { getFunc } from './ParserFunc';

function setClassInsertText(children: TAhkSymbolList): string {
    for (const ch of children) {
        if (ch instanceof CAhkFunc && ch.upName === '__NEW') {
            return ch.selectionRangeText.replace(/^__NEW/ui, '');
        }
    }
    return '';
}

function setClassBase(lStr: string, colFix: number, name: string): string {
    return lStr
        .slice(colFix + name.length, lStr.length + colFix + name.length)
        .replace(/\bextends\b/iu, '')
        .trim()
        .replace('{', '')
        .trim();
}

export function getClass(FuncInput: TFuncInput): CAhkClass | null {
    const { lStr, fistWordUp, line } = FuncInput.AhkTokenLine;

    if (fistWordUp !== 'CLASS') return null;
    // class ClassName extends BaseClassName
    const ma: RegExpMatchArray | null = lStr.match(/(?<=^\s*\bClass\b\s+)(\w+)/ui);
    if (ma === null) return null;

    const {
        DocStrMap,
        RangeEndLine,
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
        Base: setClassBase(lStr, col, name),
        range,
        selectionRange: new vscode.Range(line, col, line, col + name.length),
        insertText: `${name}${setClassInsertText(ch)}`,
        uri: document.uri,
        ch,
    });
}

// TODO use isClassDefinition replace... regex

// inline LPTSTR IsClassDefinition(LPTSTR aBuf, bool &aHasOTB)
// {
//     if (_tcsnicmp(aBuf, _T("Class"), 5) || !IS_SPACE_OR_TAB(aBuf[5])) // i.e. it's not "Class" followed by a space or tab.
//         return NULL;
// ...
