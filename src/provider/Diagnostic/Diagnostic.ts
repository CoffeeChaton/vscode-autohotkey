import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import type { TTokenStream } from '../../globalEnum';
import { getIgnore } from './getIgnore';
import type { CDiagBase } from './tools/CDiagBase';
import { getDeepErr } from './tools/getDeepErr';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getTreeErr } from './tools/getTreeErr';

type TDisplayErr = boolean[];
type TDisplayErrAndLineErr = {
    displayErr: TDisplayErr;
    lineDiagS: CDiagBase[];
};

function getDisplayErrAndLineErr(DocStrMap: TTokenStream): TDisplayErrAndLineErr {
    const displayErr: TDisplayErr = [];
    const lineDiagS: CDiagBase[] = [];

    let IgnoreLine: number = getIgnore(DocStrMap[0].textRaw, 0, -1);
    for (const { textRaw, line } of DocStrMap) {
        IgnoreLine = getIgnore(textRaw, line, IgnoreLine);
        if (line <= IgnoreLine) {
            displayErr.push(false);
            continue;
        }

        displayErr.push(true);

        const err: CDiagBase | null = getLineErr(DocStrMap, line);
        if (err !== null) lineDiagS.push(err);
    }
    return {
        displayErr,
        lineDiagS,
    };
}

// eslint-disable-next-line no-magic-numbers
const wm = new WeakMap<TTokenStream, readonly CDiagBase[]>();

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AST: TAstRoot,
): readonly CDiagBase[] {
    const cache: readonly CDiagBase[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const { displayErr, lineDiagS } = getDisplayErrAndLineErr(DocStrMap);

    const diagList: readonly CDiagBase[] = [
        ...getDeepErr(DocStrMap),
        ...lineDiagS,
        ...getTreeErr(AST, displayErr),
        ...getFuncErr(DocStrMap, [...AST], displayErr, getLintConfig().funcSize),
    ];
    // 8k lines without gc -> 3ms
    wm.set(DocStrMap, diagList);
    return diagList;
}
// TODO {base: GMem} https://www.autohotkey.com/docs/Objects.htm#Custom_Objects
