import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { diagColl } from '../../../core/diagRoot';
import { EDiagBase, TAhkSymbolList, TTokenStream } from '../../../globalEnum';
import { getFnMetaList } from '../getFnMetaList';
import { TDAMeta } from '../TypeFnMeta';
import { caseSensitivityVar } from './caseSensitivity';
import { EPrefixC502 } from './caseSensitivityMagic';
import { paramNeverUsed, varNeverUsed } from './param/paramNeverUsed';
import { paramVariadicErr } from './param/paramVariadicErr';

function diagDAFileCore(DAList: TDAMeta[]): readonly vscode.Diagnostic[] {
    const code500List = new Set<vscode.Diagnostic>();
    const code501List = new Set<vscode.Diagnostic>();
    const code502List = new Set<vscode.Diagnostic>();
    const code503List = new Set<vscode.Diagnostic>();
    const code504List = new Set<vscode.Diagnostic>();
    const code502Max = getCode502Default();
    const code503Max = getCode503Default();

    for (const DA of DAList) {
        const { paramMap, valMap } = DA;
        varNeverUsed(valMap, code500List);
        paramNeverUsed(paramMap, code501List);
        caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max); // var case sensitivity
        caseSensitivityVar(EPrefixC502.param, paramMap, code503List, code503Max);
        paramVariadicErr(paramMap, code504List);
    }

    return [
        ...code500List,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
    ];
}

export function digDAFile(
    AhkSymbolList: TAhkSymbolList,
    DocStrMap: TTokenStream,
    uri: vscode.Uri,
): void {
    const DAList: TDAMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
    const baseDiag: vscode.Diagnostic[] = (diagColl.get(uri) || [])
        .filter((diag: vscode.Diagnostic): boolean => diag.source !== EDiagBase.sourceDA);
    diagColl.set(uri, [...baseDiag, ...diagDAFileCore(DAList)]);
}
