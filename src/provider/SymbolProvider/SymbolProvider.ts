import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';

function SymBolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const { AhkSymbolList, DAList } = Detecter.updateDocDef(document);

    digDAFile(DAList, document.uri); // FIXME debounce

    return AhkSymbolList as vscode.DocumentSymbol[];
}
export class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return SymBolProviderCore(document);
    }

    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
