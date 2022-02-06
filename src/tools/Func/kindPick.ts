import * as vscode from 'vscode';

export function kindPick(kind: vscode.SymbolKind): null | 'Function' | 'Method' {
    // dprint-ignore
    switch (kind) {
        case vscode.SymbolKind.Function: return 'Function';
        case vscode.SymbolKind.Method: return 'Method';
        default: return null;
    }
}
