import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getCode500Default, getCode502Default, getCode503Default } from '../../../configUI';
import { diagColl } from '../../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { CDiagFn } from '../../../provider/Diagnostic/tools/CDiagFn';
import type { C502Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';
import { EPrefixC502 } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';
import type { C506Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C506Class';
import { caseSensitivityVar } from './caseSensitivity';
import { C506DiagNumberStyle } from './otherDiag/C506DiagNumberStyle';
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
    const code500Max: number = getCode500Default();
    const code502Max: number = getCode502Default();
    const code503Max: number = getCode503Default();

    const cache: TDaDiagCache | undefined = wm.get(DAList);
    if (
        cache !== undefined
        && cache.code500Max === code500Max
        && cache.code502Max === code502Max
        && cache.code503Max === code503Max
    ) {
        return cache.DADiagList;
    }

    // FIXME WTF style
    const code500List: CDiagFn[] = []; // WTF...
    const code501List: CDiagFn[] = [];
    const code502List: C502Class[] = [];
    const code503List: C502Class[] = [];
    const code504List: CDiagFn[] = [];
    const code505List: CDiagFn[] = [];
    const code506List: C506Class[] = [];

    for (const DA of DAList) {
        const { paramMap, valMap, textMap } = DA;
        NeverUsedVar(valMap, code500List, code500Max, displayErrList);
        NeverUsedParam(paramMap, code501List, displayErrList);
        caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max, displayErrList); // var case sensitivity
        caseSensitivityVar(EPrefixC502.param, paramMap, code503List, code503Max, displayErrList);
        paramVariadicErr(paramMap, code504List);
        paramVariadicErr(paramMap, code505List);
        C506DiagNumberStyle(textMap, code506List);
    }

    const DADiagList: readonly CDiagFn[] = [
        ...code500List,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
        ...code505List,
        ...code506List,
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
