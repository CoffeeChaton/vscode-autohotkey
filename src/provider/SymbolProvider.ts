// eslint-disable-next-line max-classes-per-file
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return Detecter.updateDocDef(false, document.uri.fsPath);
    }
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
