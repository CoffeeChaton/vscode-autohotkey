import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import type { CDiagBase } from './tools/CDiagBase';
import { getDeepErr } from './tools/getDeepErr';
import { getFuncErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getMultilineDiag } from './tools/getMultilineDiag';
import { getTreeErr } from './tools/getTreeErr';

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
        ...getLineErr(DocStrMap),
        ...getTreeErr(AST, displayErrList),
        ...getFuncErr(DocStrMap, [...AST], getLintConfig().funcSize),
        ...getMultilineDiag(DocStrMap),
    ];
    // 8k lines without gc -> 7ms
    wm.set(DocStrMap, diagList);
    return diagList;
}
