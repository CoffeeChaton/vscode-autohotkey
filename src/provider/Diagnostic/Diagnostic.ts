import * as vscode from 'vscode';
import { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import { TTokenStream } from '../../globalEnum';
import { getIgnore } from './getIgnore';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getTreeErr } from './tools/getTreeErr';

// eslint-disable-next-line no-magic-numbers
const wm: WeakMap<TTokenStream, vscode.Diagnostic[]> = new WeakMap();

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AhkSymbolList: TAhkSymbolList,
): vscode.Diagnostic[] {
    const cache: vscode.Diagnostic[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

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
        const err: vscode.Diagnostic | null = getLineErr(DocStrMap, line);
        if (err !== null) lineDiagS.push(err);
    }

    const diagList: vscode.Diagnostic[] = [
        ...lineDiagS,
        ...getTreeErr(AhkSymbolList, displayErr),
        ...getFuncErr(DocStrMap, AhkSymbolList, displayErr, getLintConfig().funcSize),
    ];
    // 8k lines without hashCache -> 6ms
    // with hashCache -> 2ms
    // I think this way, complexity && ram >> 4ms
    wm.set(DocStrMap, diagList);
    return diagList;
}
// TODO {base: GMem} https://www.autohotkey.com/docs/Objects.htm#Custom_Objects
