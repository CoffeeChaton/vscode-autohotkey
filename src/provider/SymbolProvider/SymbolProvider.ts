import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { useSymBolProvider } from '../../configUI';
import { pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';

function SymBolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const { AST, DocStrMap } = pm.updateDocDef(document);

    const DAList: CAhkFunc[] = getDAList(AST);
    digDAFile(DAList, document.uri, DocStrMap);

    return useSymBolProvider()
        ? [...AST]
        : [];
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
