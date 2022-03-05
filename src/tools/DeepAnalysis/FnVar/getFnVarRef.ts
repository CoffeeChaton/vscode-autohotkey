import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TParamOrValMap,
    TTokenStream,
} from '../../../globalEnum';
import { newC502 } from './def/diag/c502';

function getValRegMap(paramOrValMap: TParamOrValMap): Map<string, RegExp> {
    const regMap: Map<string, RegExp> = new Map<string, RegExp>();

    for (const [valName] of paramOrValMap) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        regMap.set(valName, new RegExp(`(?<![.\`])\\b(${valName})\\b(?!\\()`, 'igu'));
    }
    return regMap;
}

type TNeedSetRef = {
    o: RegExpMatchArray;
    valUpName: string;
    line: number;
};

function getValRef(param: TNeedSetRef, paramOrValMap: TParamOrValMap): void {
    const {
        o,
        valUpName,
        line,
    } = param;
    const newRawName: string = o[1];
    const character = o.index;
    const oldVal = paramOrValMap.get(valUpName);

    if (oldVal === undefined || character === undefined) {
        const msg = '🚀 ~ ERROR OF getValRef--40--71-33 oldVal === undefined || character === undefined';
        console.error('🚀 ~ WTF getValRef ~ valUpName', valUpName, oldVal);
        void vscode.window.showErrorMessage(msg);
        // WTF ???
        return;
    }

    const Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + newRawName.length),
    );
    const { refRangeList, c502Array } = oldVal;
    refRangeList.push(Range);
    c502Array.push(newC502(oldVal.keyRawName, newRawName));
}

// eslint-disable-next-line max-params
export function getFnVarRef(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    paramOrValMap: TParamOrValMap,
): void {
    const regMap: Map<string, RegExp> = getValRegMap(paramOrValMap);
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        if (lStr.trim() === '') continue;

        for (const [valUpName, reg] of regMap) {
            for (const o of lStr.matchAll(reg)) {
                getValRef({
                    o,
                    valUpName,
                    line,
                }, paramOrValMap);
            }
        }
    }
}

// FIXME:
/** FIXME:
 *  cat := "neko"
 *  for i in range
 * ...
 * ......
 *  MsgBox , i am cat
 * Text is not var `i`
 */
