import type * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';

export function getFuncWithPos(
    fsPath: string,
    position: vscode.Position,
): CAhkFunc | undefined {
    const AST: readonly TTopSymbol[] | undefined = pm.getDocMap(fsPath)?.AST; // FIXME 0 don't use getDocMap
    if (AST === undefined) return undefined;

    for (const func of AST) {
        if (
            func instanceof CAhkFunc
            && func.range.contains(position)
        ) {
            return func;
        }
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
