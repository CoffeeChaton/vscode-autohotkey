import * as vscode from 'vscode';
import { CAhkClass, TClassChildren } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { getTopSymbolWithPos } from './getTopSymbolWithPos';

function getMethodWithPos(
    classCh: TClassChildren[],
    position: vscode.Position,
): null | CAhkFunc {
    for (const DA of classCh) {
        if (!DA.range.contains(position)) continue;

        if (DA instanceof CAhkFunc) return DA;
        if (DA instanceof CAhkClass) return getMethodWithPos(DA.children, position);
    }
    return null;
}

export function getDAWithPos(
    AhkSymbolList: readonly TTopSymbol[],
    position: vscode.Position,
): null | CAhkFunc {
    const TopSymbol: TTopSymbol | null = getTopSymbolWithPos(AhkSymbolList, position);
    if (TopSymbol === null) return null;
    if (TopSymbol instanceof CAhkFunc) return TopSymbol;
    if (TopSymbol instanceof CAhkClass) return getMethodWithPos(TopSymbol.children, position);

    return null;
}
