import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { TAhkSymbolList } from '../../../globalEnum';
import { DeepAnalysis } from '../DeepAnalysis';
import { TDeepAnalysisMeta } from '../FnMetaType';
import { caseSensitivityVar } from './caseSensitivity';
import { EPrefixC502 } from './caseSensitivityMagic';
import { paramNeverUsed } from './param/paramNeverUsed';
import { paramVariadicErr } from './param/paramVariadicErr';

export function diagDAFile(
    AhkSymbolList: TAhkSymbolList,
    document: vscode.TextDocument,
): readonly vscode.Diagnostic[] {
    const code501List = new Set<vscode.Diagnostic>();
    const code502List = new Set<vscode.Diagnostic>();
    const code503List = new Set<vscode.Diagnostic>();
    const code504List = new Set<vscode.Diagnostic>();
    const code502Max = getCode502Default();
    const code503Max = getCode503Default();

    for (const ahkSymbol of AhkSymbolList) {
        const DA: TDeepAnalysisMeta | null = DeepAnalysis(document, ahkSymbol);
        if (DA !== null) {
            const { argMap, valMap } = DA;
            paramNeverUsed(argMap, code501List);
            caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max); // var case sensitivity
            caseSensitivityVar(EPrefixC502.param, argMap, code503List, code503Max);
            paramVariadicErr(argMap, code504List);
        }
    }

    return [
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
    ];
}
