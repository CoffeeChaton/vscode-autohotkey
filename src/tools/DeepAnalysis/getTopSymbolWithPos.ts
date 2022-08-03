import type * as vscode from 'vscode';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';

export function getTopSymbolWithPos( // FIXME 0 rm this func
    AstRoot: TAstRoot,
    position: vscode.Position,
): TTopSymbol | null {
    for (const topSymbol of AstRoot) {
        if (topSymbol.range.contains(position)) {
            return topSymbol;
        }
    }
    return null;
}
