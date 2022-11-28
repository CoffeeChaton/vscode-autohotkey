import * as vscode from 'vscode';
import type { TAhkSymbol, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';
import { CMemo } from '../../tools/CMemo';

// dprint-ignore
const DocSymbol2SymbolInfo = new CMemo<TAstRoot, vscode.SymbolInformation[]>( // 4ms -> 0ms
    (AstRoot: TAstRoot): vscode.SymbolInformation[] => AstRoot.map((AhkSymbol: TAhkSymbol): vscode.SymbolInformation => {
        const {
            name,
            kind,
            range,
            detail,
            uri,
        } = AhkSymbol;

        return new vscode.SymbolInformation(name, kind, detail, new vscode.Location(uri, range));
    })
);

function WorkspaceSymbolCore(): vscode.SymbolInformation[] {
    const result: vscode.SymbolInformation[] = [];

    for (const { AST } of pm.DocMap.values()) { // keep output order is OK
        result.push(...DocSymbol2SymbolInfo.up(AST));
    }

    return result;
}

/**
 * ctrl + T, go to Symbol in Workspace
 */
export const WorkspaceSymbolProvider: vscode.WorkspaceSymbolProvider = {
    provideWorkspaceSymbols(
        _query: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return WorkspaceSymbolCore();
    },
};
