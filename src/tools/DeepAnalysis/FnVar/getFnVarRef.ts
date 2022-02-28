import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TTokenStream,
    TValAnalysis,
    TValMap,
} from '../../../globalEnum';
import { newC502 } from './def/diag/c502';

function getValRegMap(valMap: TValMap): Map<string, RegExp> {
    const regMap: Map<string, RegExp> = new Map<string, RegExp>();

    for (const [valName] of valMap) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        regMap.set(valName, new RegExp(`(?<![.\`])\\b(${valName})\\b`, 'igu'));
    }
    return regMap;
}

type TNeedSetRef = {
    o: RegExpMatchArray;
    valMap: TValMap;
    valUpName: string;
    uri: vscode.Uri;
    line: number;
};
function getValRef(param: TNeedSetRef): void {
    const {
        o,
        valMap,
        valUpName,
        uri,
        line,
    } = param;
    const newRawName: string = o[1];
    const character = o.index;
    const oldVal: TValAnalysis | undefined = valMap.get(valUpName);

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
    const { refLocList, c502Array } = oldVal;
    const loc = new vscode.Location(uri, Range);
    refLocList.push(loc);
    c502Array.push(newC502(oldVal, newRawName));
}

// eslint-disable-next-line max-params
export function getFnVarRef(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    valMap: TValMap,
): void {
    const regMap: Map<string, RegExp> = getValRegMap(valMap);
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        if (lStr.trim() === '') continue;

        for (const [valUpName, reg] of regMap) {
            for (const o of lStr.matchAll(reg)) {
                getValRef({
                    valMap,
                    o,
                    valUpName,
                    uri,
                    line,
                });
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
