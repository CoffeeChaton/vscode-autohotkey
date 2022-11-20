import type * as vscode from 'vscode';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getLintConfig } from '../../configUI';
import { diagColl, getWithOutNekoDiag } from '../../core/diagColl';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import type { CDiagBase } from './tools/CDiagBase';
import { getFuncSizeErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getMultilineDiag } from './tools/getMultilineDiag';
import { getTreeErr } from './tools/getTreeErr';

const wm = new WeakMap<TTokenStream, readonly CDiagBase[]>();

function baseDiagnostic(DocStrMap: TTokenStream, AST: TAstRoot): readonly CDiagBase[] {
    const cache: readonly CDiagBase[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const displayErrList: readonly boolean[] = DocStrMap.map(({ displayErr }: TAhkTokenLine): boolean => displayErr);

    const diagList: readonly CDiagBase[] = [
        ...getLineErr(DocStrMap),
        ...getTreeErr(AST, displayErrList, DocStrMap),
        ...getMultilineDiag(DocStrMap),
    ];
    wm.set(DocStrMap, diagList);
    return diagList;
}

export function setBaseDiag(uri: vscode.Uri, DocStrMap: TTokenStream, AST: TAstRoot): void {
    const baseDiag: readonly CDiagBase[] = baseDiagnostic(DocStrMap, AST);

    // TODO: read config and filter baseDiag
    diagColl.set(uri, [
        ...getWithOutNekoDiag(diagColl.get(uri) ?? []),
        ...baseDiag,
        ...getFuncSizeErr(getDAListTop(AST), DocStrMap, getLintConfig().funcSize),
    ]);
}
