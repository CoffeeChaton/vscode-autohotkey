import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { diagColl } from '../../../core/Detecter';
import { EDiagBase } from '../../../globalEnum';
import { ClassWm } from '../../wm';
import { TDAMeta } from '../TypeFnMeta';
import { caseSensitivityVar } from './caseSensitivity';
import { EPrefixC502 } from './caseSensitivityMagic';
import { NeverUsedParam, NeverUsedVar } from './param/paramNeverUsed';
import { paramVariadicErr } from './param/paramVariadicErr';

type TDaDiagCache = {
    DADiagList: readonly vscode.Diagnostic[];
    code502Max: number;
    code503Max: number;
};

// eslint-disable-next-line no-magic-numbers
const min3 = 3 * 60 * 1000;
const wm: ClassWm<TDAMeta[], TDaDiagCache> = new ClassWm(min3, 'diagDAFileCore', 0);

function diagDAFileCore(DAList: TDAMeta[]): readonly vscode.Diagnostic[] {
    const code502Max = getCode502Default();
    const code503Max = getCode503Default();

    const cache: TDaDiagCache | undefined = wm.getWm(DAList);
    if (cache !== undefined) {
        if (cache.code502Max === code502Max && cache.code503Max === code503Max) {
            return cache.DADiagList;
        }
    }
    const code500List: vscode.Diagnostic[] = []; // WTF...
    const code501List: vscode.Diagnostic[] = [];
    const code502List: vscode.Diagnostic[] = [];
    const code503List: vscode.Diagnostic[] = [];
    const code504List: vscode.Diagnostic[] = [];

    for (const DA of DAList) {
        const { paramMap, valMap } = DA;
        NeverUsedVar(valMap, code500List);
        NeverUsedParam(paramMap, code501List);
        caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max); // var case sensitivity
        caseSensitivityVar(EPrefixC502.param, paramMap, code503List, code503Max);
        paramVariadicErr(paramMap, code504List);
    }

    const DADiagList: readonly vscode.Diagnostic[] = [
        ...code500List,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
    ];

    wm.setWm(DAList, {
        DADiagList,
        code502Max,
        code503Max,
    });
    return DADiagList;
}

export function digDAFile(
    DAList: TDAMeta[],
    uri: vscode.Uri,
): void {
    const baseDiag: vscode.Diagnostic[] = (diagColl.get(uri) || [])
        .filter((diag: vscode.Diagnostic): boolean => diag.source !== EDiagBase.sourceDA);
    diagColl.set(uri, [...baseDiag, ...diagDAFileCore(DAList)]);
}
