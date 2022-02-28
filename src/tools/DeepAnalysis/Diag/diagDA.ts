import * as vscode from 'vscode';
import { diagColl } from '../../../core/diag/diagRoot';
import { EDiagBase, TAhkSymbolList } from '../../../globalEnum';
import { DeepAnalysis } from '../DeepAnalysis';
import { diagDACore, TDiagDA } from './diagDACore';

export function diagDAFile(
    AhkSymbolList: TAhkSymbolList,
    document: vscode.TextDocument,
    Uri: vscode.Uri,
): void {
    let DiagDA: TDiagDA = {
        code501List: [],
        code502List: [],
        code503List: [],
    };
    for (const ahkSymbol of AhkSymbolList) {
        const DA = DeepAnalysis(document, ahkSymbol);
        if (DA) {
            DiagDA = diagDACore(DA, DiagDA);
        }
    }
    const baseAll = diagColl.get(Uri) || [];
    const baseDiag = baseAll.filter((v) => v.source !== EDiagBase.sourceDA);
    diagColl.set(Uri, [
        ...baseDiag,
        ...DiagDA.code501List,
        ...DiagDA.code502List,
        ...DiagDA.code503List,
    ]);
}
