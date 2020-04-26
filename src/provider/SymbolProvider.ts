import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { EMode } from '../tools/globalSet';

export default class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    provideDocumentSymbols(document: vscode.TextDocument,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return Detecter.getDocDef(document.uri.fsPath, EMode.ahkAll, true);
    }
    // IS BAD   https://code.visualstudio.com/api/references/vscode-api#DocumentSymbol  IS BAD
}
