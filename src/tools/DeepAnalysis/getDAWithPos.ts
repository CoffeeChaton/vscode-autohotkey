import * as vscode from 'vscode';
import { CAhkClass, TClassChildren } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { Detecter } from '../../core/Detecter';
import { getDAList } from './getDAList';
import { getTopSymbolWithPos } from './getTopSymbolWithPos';

// FIXME: remove getDAWithPos
export function getDAWithPos(
    fsPath: string,
    position: vscode.Position,
): undefined | CAhkFunc {
    const AhkSymbolList: readonly TTopSymbol[] | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);

    for (const DA of DAList) {
        if (DA.range.contains(position)) return DA;
    }
    return undefined;
}

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

export function getDAWithPosNext(
    AhkSymbolList: readonly TTopSymbol[],
    position: vscode.Position,
): null | CAhkFunc {
    const TopSymbol: TTopSymbol | null = getTopSymbolWithPos(AhkSymbolList, position);
    if (TopSymbol === null) return null;
    if (TopSymbol instanceof CAhkFunc) return TopSymbol;
    if (TopSymbol instanceof CAhkClass) {
        return getMethodWithPos(TopSymbol.children, position);
    }
    return null;
}
