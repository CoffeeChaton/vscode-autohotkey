import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { diagColl } from '../../../core/diagRoot';
import { EDiagBase, TAhkSymbolList } from '../../../globalEnum';
import { DeepAnalysis } from '../DeepAnalysis';
import { caseSensitivityVar } from './caseSensitivity';
import { paramNeverUsed } from './param/paramNeverUsed';
import { paramVariadicErr } from './param/paramVariadicErr';

export function diagDAFile(
    AhkSymbolList: TAhkSymbolList,
    document: vscode.TextDocument,
    Uri: vscode.Uri,
): void {
    const code501List: vscode.Diagnostic[] = [];
    const code502List: vscode.Diagnostic[] = [];
    const code503List: vscode.Diagnostic[] = [];
    const code504List: vscode.Diagnostic[] = [];
    const code502Max = getCode502Default();
    const code503Max = getCode503Default();
    for (const ahkSymbol of AhkSymbolList) {
        const DA = DeepAnalysis(document, ahkSymbol);
        if (DA) {
            paramNeverUsed(DA.argMap, code501List);
            caseSensitivityVar('var', DA.valMap, code502List, code502Max); // var case sensitivity
            caseSensitivityVar('param', DA.argMap, code503List, code503Max);
            paramVariadicErr(DA.argMap, code504List);
        }
    }
    const baseAll = diagColl.get(Uri) || [];
    const baseDiag = baseAll.filter((v) => v.source !== EDiagBase.sourceDA);
    diagColl.set(Uri, [
        ...baseDiag,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
    ]);
}
