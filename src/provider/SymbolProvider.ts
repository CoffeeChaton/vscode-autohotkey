/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return Detecter.updateDocDef(true, document.uri.fsPath);
    }
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
