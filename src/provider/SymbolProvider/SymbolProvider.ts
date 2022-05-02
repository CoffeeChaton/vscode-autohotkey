import * as vscode from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';

function SymBolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const { AhkSymbolList } = Detecter.updateDocDef(document);

    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);
    digDAFile(DAList, document.uri);

    return AhkSymbolList as vscode.DocumentSymbol[];
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
