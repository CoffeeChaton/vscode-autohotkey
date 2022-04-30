import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';

export function getFuncWithPos(
    fsPath: string,
    position: vscode.Position,
): undefined | CAhkFuncSymbol {
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    for (const DA of AhkSymbolList) {
        if (
            DA.kind === vscode.SymbolKind.Function
            && DA.range.contains(position)
            && DA instanceof CAhkFuncSymbol
        ) {
            return DA;
        }
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
