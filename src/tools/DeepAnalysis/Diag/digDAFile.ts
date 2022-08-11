import type * as vscode from 'vscode';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getCode500Default, getCode502Default, getCode503Default } from '../../../configUI';
import { diagColl } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { CDiagFn } from '../../../provider/Diagnostic/tools/CDiagFn';
import { caseSensitivityVar } from './caseSensitivity';
import { EPrefixC502 } from './caseSensitivityMagic';
import { NeverUsedParam, NeverUsedVar } from './param/paramNeverUsed';
import { paramVariadicErr } from './param/paramVariadicErr';

type TDaDiagCache = {
    DADiagList: readonly CDiagFn[];
    code500Max: number;
    code502Max: number;
    code503Max: number;
};

const wm = new WeakMap<CAhkFunc[], TDaDiagCache>();

function diagDAFileCore(DAList: CAhkFunc[], displayErrList: readonly boolean[]): readonly CDiagFn[] {
    const code500Max = getCode500Default();
    const code502Max = getCode502Default();
    const code503Max = getCode503Default();

    const cache: TDaDiagCache | undefined = wm.get(DAList);
    if (
        cache !== undefined
        && cache.code500Max === code500Max
        && cache.code502Max === code502Max
        && cache.code503Max === code503Max
    ) {
        return cache.DADiagList;
    }

    const code500List: CDiagFn[] = []; // WTF...
    const code501List: CDiagFn[] = [];
    const code502List: CDiagFn[] = [];
    const code503List: CDiagFn[] = [];
    const code504List: CDiagFn[] = [];

    for (const DA of DAList) {
        if (!(DA instanceof CAhkFunc)) continue;
        const { paramMap, valMap } = DA;
        NeverUsedVar(valMap, code500List, code500Max, displayErrList);
        NeverUsedParam(paramMap, code501List, displayErrList);
        caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max, displayErrList); // var case sensitivity
        caseSensitivityVar(EPrefixC502.param, paramMap, code503List, code503Max, displayErrList);
        paramVariadicErr(paramMap, code504List);
    }

    const DADiagList: readonly CDiagFn[] = [
        ...code500List,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
    ];

    wm.set(DAList, {
        DADiagList,
        code500Max,
        code502Max,
        code503Max,
    });
    return DADiagList;
}

export function digDAFile(DAList: CAhkFunc[], uri: vscode.Uri, DocStrMap: TTokenStream): void {
    const baseDiag = (diagColl.get(uri) ?? [])
        .filter((diag): boolean => !(diag instanceof CDiagFn));

    const displayFnErrList: readonly boolean[] = DocStrMap
        .map(({ displayFnErr }: TAhkTokenLine): boolean => displayFnErr);

    diagColl.set(uri, [
        ...baseDiag,
        ...diagDAFileCore(DAList, displayFnErrList),
    ]);
}
