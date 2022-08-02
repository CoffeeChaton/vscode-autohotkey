import type * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { pm } from '../../core/ProjectManager';

export function getFuncWithPos(
    fsPath: string,
    position: vscode.Position,
): CAhkFunc | undefined {
    const AhkSymbolList: readonly TTopSymbol[] | undefined = pm.getDocMap(fsPath)?.AST;
    if (AhkSymbolList === undefined) return undefined;

    for (const DA of AhkSymbolList) {
        if (
            DA instanceof CAhkFunc
            && DA.range.contains(position)
        ) {
            return DA;
        }
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
