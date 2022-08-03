import * as vscode from 'vscode';
import type { TAhkSymbol, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';

const wm = new WeakMap<TAstRoot, vscode.SymbolInformation[]>(); // 4ms -> 0ms

function DocSymbol2SymbolInfo(AstRoot: TAstRoot): vscode.SymbolInformation[] {
    const cache: vscode.SymbolInformation[] | undefined = wm.get(AstRoot);
    if (cache !== undefined) return cache;

    const result: vscode.SymbolInformation[] = AstRoot.map((AhkSymbol: TAhkSymbol): vscode.SymbolInformation => {
        const {
            name,
            kind,
            range,
            detail,
            uri,
        } = AhkSymbol;

        return new vscode.SymbolInformation(name, kind, detail, new vscode.Location(uri, range));
    });

    wm.set(AstRoot, result);
    return result;
}

function WorkspaceSymbolCore(): vscode.SymbolInformation[] {
    const result: vscode.SymbolInformation[] = [];

    for (const { AST } of pm.DocMap.values()) { // keep output order is OK
        result.push(...DocSymbol2SymbolInfo(AST));
    }

    return result;
}

/**
 * ctrl + T, list All Symbol
 */
export const WorkspaceSymbolProvider: vscode.WorkspaceSymbolProvider = {
    provideWorkspaceSymbols(
        _query: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return WorkspaceSymbolCore();
    },
};
