import type * as vscode from 'vscode';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import type { TTokenStream } from '../../globalEnum';
import { getIgnore } from './getIgnore';
import { getDeepErr } from './tools/getDeepErr';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getTreeErr } from './tools/getTreeErr';
import type { CNekoBaseLineDiag } from './tools/lineErr/lineErrTools';

type TDisplayErr = boolean[];
type TDisplayErrAndLineErr = {
    displayErr: TDisplayErr;
    lineDiagS: CNekoBaseLineDiag[];
};

function getDisplayErrAndLineErr(DocStrMap: TTokenStream): TDisplayErrAndLineErr {
    const displayErr: TDisplayErr = [];
    const lineDiagS: CNekoBaseLineDiag[] = [];

    let IgnoreLine: number = getIgnore(DocStrMap[0].textRaw, 0, -1);
    for (const { textRaw, line } of DocStrMap) {
        IgnoreLine = getIgnore(textRaw, line, IgnoreLine);
        if (line <= IgnoreLine) {
            displayErr.push(false);
            continue;
        }

        displayErr.push(true);

        const err: CNekoBaseLineDiag | null = getLineErr(DocStrMap, line);
        if (err !== null) lineDiagS.push(err);
    }
    return {
        displayErr,
        lineDiagS,
    };
}

// eslint-disable-next-line no-magic-numbers
const wm = new WeakMap<TTokenStream, readonly vscode.Diagnostic[]>();

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AhkSymbolList: TAhkSymbolList,
): readonly vscode.Diagnostic[] {
    const cache: readonly vscode.Diagnostic[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const { displayErr, lineDiagS } = getDisplayErrAndLineErr(DocStrMap);

    const diagList: readonly vscode.Diagnostic[] = [
        ...getDeepErr(DocStrMap),
        ...lineDiagS,
        ...getTreeErr(AhkSymbolList, displayErr),
        ...getFuncErr(DocStrMap, AhkSymbolList, displayErr, getLintConfig().funcSize),
    ];
    // 8k lines without gc -> 3ms
    wm.set(DocStrMap, diagList);
    return diagList;
}
// TODO {base: GMem} https://www.autohotkey.com/docs/Objects.htm#Custom_Objects
