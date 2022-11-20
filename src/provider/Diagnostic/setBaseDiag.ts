/* eslint-disable no-magic-numbers */
import type * as vscode from 'vscode';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getDiagConfig } from '../../configUI';
import { diagColl, getWithOutNekoDiag } from '../../core/diagColl';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import type { CDiagBase } from './tools/CDiagBase';
import { getFuncSizeErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getMultilineDiag } from './tools/getMultilineDiag';
import { getTreeErr } from './tools/getTreeErr';
import { getAssignErr } from './tools/lineErr/assignErr';

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
    const baseDiagSet = new Set<CDiagBase>(baseDiagnostic(DocStrMap, AST));

    const DiagShow: CDiagBase[] = [];
    const { code800Deprecated, code107LegacyAssignment, code300FuncSize } = getDiagConfig();

    for (const diag of baseDiagSet) {
        const { value } = diag.code;
        if ((value > 800 && value < 900) && !code800Deprecated) {
            continue;
        }
        DiagShow.push(diag);
    }
    if (code107LegacyAssignment) {
        DiagShow.push(...getAssignErr(DocStrMap));
    }

    diagColl.set(uri, [
        ...getWithOutNekoDiag(diagColl.get(uri) ?? []),
        ...DiagShow,
        ...getFuncSizeErr(getDAListTop(AST), DocStrMap, code300FuncSize),
    ]);
}
