/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
import * as vscode from 'vscode';
import {
    TAhkSymbolList,
    TTokenStream,
} from '../../globalEnum';
import { ClassWm } from '../../tools/wm';
import { getIgnore } from './getIgnore';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getTreeErr } from './tools/getTreeErr';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TTokenStream, vscode.Diagnostic[]>(10 * 60 * 1000, 'baseDiagnostic', 3000);

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AhkSymbolList: TAhkSymbolList,
): vscode.Diagnostic[] {
    const cache = wm.getWm(DocStrMap);
    if (cache) return cache;

    // const timeStart: number = Date.now();

    const lineMax: number = DocStrMap.length;
    let IgnoreLine = -1;
    const displayErr: boolean[] = [];
    const lineDiagS: vscode.Diagnostic[] = [];

    IgnoreLine = getIgnore(DocStrMap[0].textRaw, 0, IgnoreLine);
    for (let line = 0; line < lineMax; line++) {
        if (line <= IgnoreLine) {
            displayErr.push(false);
            continue;
        }
        IgnoreLine = getIgnore(DocStrMap[line].textRaw, line, IgnoreLine);

        displayErr.push(true);
        const err = getLineErr(DocStrMap, line);
        if (err !== null) lineDiagS.push(err);
    }

    const diagList = [
        ...lineDiagS,
        ...getTreeErr(AhkSymbolList, displayErr),
        ...getFuncErr(DocStrMap, AhkSymbolList, displayErr),
    ];
    // 8k lines without hashCache -> 6ms
    // with hashCache -> 2ms
    // I think this way, complexity && ram >> 4ms
    return wm.setWm(DocStrMap, diagList);
}
