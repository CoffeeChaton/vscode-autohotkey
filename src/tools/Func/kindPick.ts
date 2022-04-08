import * as vscode from 'vscode';

export function kindPick(kind: vscode.SymbolKind): null | vscode.SymbolKind.Function | vscode.SymbolKind.Method {
    switch (kind) {
        case vscode.SymbolKind.Function:
            return vscode.SymbolKind.Function;
        case vscode.SymbolKind.Method:
            return vscode.SymbolKind.Method;
        default:
            return null;
    }
}
