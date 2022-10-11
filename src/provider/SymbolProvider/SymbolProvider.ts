import * as path from 'node:path';
import type * as vscode from 'vscode';
import { showTimeSpend, useSymbolProvider } from '../../configUI';
import { pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';

function SymbolProviderCore(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const { AST, DocStrMap, ModuleVar } = pm.updateDocDef(document);

    digDAFile(getDAList(AST), ModuleVar, document.uri, DocStrMap);

    showTimeSpend(path.basename(document.uri.fsPath));

    return useSymbolProvider()
        ? [...AST]
        : [];
}

export const SymbolProvider: vscode.DocumentSymbolProvider = {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        return SymbolProviderCore(document);
    },
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
};
