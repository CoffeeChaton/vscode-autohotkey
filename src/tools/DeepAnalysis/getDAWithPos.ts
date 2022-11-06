import type * as vscode from 'vscode';
import type { TClassChildren } from '../../AhkSymbol/CAhkClass';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';

function getMethodWithPos(
    classCh: TClassChildren[],
    position: vscode.Position,
): CAhkFunc | null {
    const DA: TClassChildren | undefined = classCh
        .find((ch: TClassChildren): boolean => ch.range.contains(position));

    if (DA === undefined) return null;
    if (DA instanceof CAhkFunc) return DA;
    if (DA instanceof CAhkClass) return getMethodWithPos(DA.children, position);

    return null;
}

export function getDAWithPos(
    AstRoot: TAstRoot,
    position: vscode.Position,
): CAhkFunc | null {
    const TopSymbol: TTopSymbol | undefined = AstRoot.find((top: TTopSymbol): boolean => top.range.contains(position));
    if (TopSymbol === undefined) return null;
    if (TopSymbol instanceof CAhkFunc) return TopSymbol;
    if (TopSymbol instanceof CAhkClass) return getMethodWithPos(TopSymbol.children, position);

    return null;
}
