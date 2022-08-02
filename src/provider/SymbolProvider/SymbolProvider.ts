import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';

function SymBolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const { AST: AhkSymbolList } = pm.updateDocDef(document);

    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);
    digDAFile(DAList, document.uri);

    return [...AhkSymbolList];
}

export const SymBolProvider: vscode.DocumentSymbolProvider = {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return SymBolProviderCore(document);
    },
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
};
