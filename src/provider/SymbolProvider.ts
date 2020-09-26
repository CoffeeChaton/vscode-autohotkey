// eslint-disable-next-line no-unused-vars
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentSymbols(document: vscode.TextDocument,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return Detecter.updateDocDef(document.uri.fsPath);
    }
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
