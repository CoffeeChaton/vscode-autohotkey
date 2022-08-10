import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import type { CDiagBase } from './tools/CDiagBase';
import { getDeepErr } from './tools/getDeepErr';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getTreeErr } from './tools/getTreeErr';

function getDisplayErrAndLineErr(DocStrMap: TTokenStream): CDiagBase[] {
    return DocStrMap
        .filter((x: TAhkTokenLine): boolean => x.displayErr)
        .map((x: TAhkTokenLine): CDiagBase | null => getLineErr(DocStrMap, x.line))
        .filter<CDiagBase>((x: CDiagBase | null): x is CDiagBase => x !== null);
}

const wm = new WeakMap<TTokenStream, readonly CDiagBase[]>();

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AST: TAstRoot,
): readonly CDiagBase[] {
    const cache: readonly CDiagBase[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const displayErrList: readonly boolean[] = DocStrMap.map(({ displayErr }: TAhkTokenLine): boolean => displayErr);

    const diagList: readonly CDiagBase[] = [
        ...getDeepErr(DocStrMap),
        ...getDisplayErrAndLineErr(DocStrMap),
        ...getTreeErr(AST, displayErrList),
        ...getFuncErr(DocStrMap, [...AST], displayErrList, getLintConfig().funcSize),
    ];
    // 8k lines without gc -> 3ms
    wm.set(DocStrMap, diagList);
    return diagList;
}
// TODO {base: GMem} https://www.autohotkey.com/docs/Objects.htm#Custom_Objects
