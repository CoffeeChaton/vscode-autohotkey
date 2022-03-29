import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgAnalysis,
    TParamOrValMap,
    TTokenStream,
    TValAnalysis,
} from '../../../globalEnum';
import { newC502 } from './def/diag/c502';

function getValRegMap(paramOrValMap: TParamOrValMap): Map<string, RegExp> {
    const regMap: Map<string, RegExp> = new Map<string, RegExp>();

    for (const valUpName of paramOrValMap.keys()) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        regMap.set(valUpName, new RegExp(`(?<![.\`])\\b(${valUpName})\\b(?!\\()`, 'igu'));
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
    const character: number | undefined = o.index;
    const oldVal: TValAnalysis | TArgAnalysis | undefined = paramOrValMap.get(valUpName);

    if (oldVal === undefined || character === undefined) {
        const msg = '🚀 ~ ERROR OF getValRef--40--71-33 oldVal === undefined || character === undefined';
        console.error('🚀 ~ WTF getValRef ~ valUpName', valUpName, oldVal);
        void vscode.window.showErrorMessage(msg);
        // WTF ???
        return;
    }

    const startPos: vscode.Position = new vscode.Position(line, character);
    if (oldVal.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
        return;
    }

    const Range: vscode.Range = new vscode.Range(
        startPos,
        new vscode.Position(line, character + newRawName.length),
    );

    oldVal.refRangeList.push(Range);
    oldVal.c502Array.push(newC502(oldVal.keyRawName, newRawName));
}

// eslint-disable-next-line max-params
export function getDARef(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    paramOrValMap: TParamOrValMap,
): void {
    const regMap: Map<string, RegExp> = getValRegMap(paramOrValMap);
    const startLine: number = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        const lineStrLen: number = lStr.trim().length;
        if (lineStrLen === 0) continue;

        for (const [valUpName, reg] of regMap) {
            if (lineStrLen < valUpName.length) continue;

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
