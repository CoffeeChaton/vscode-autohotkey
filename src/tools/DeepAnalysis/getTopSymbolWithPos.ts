import type * as vscode from 'vscode';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';

export function getTopSymbolWithPos(
    AhkSymbolList: readonly TTopSymbol[],
    position: vscode.Position,
): TTopSymbol | null {
    for (const topSymbol of AhkSymbolList) {
        if (topSymbol.range.contains(position)) {
            return topSymbol;
        }
    }
    return null;
}
