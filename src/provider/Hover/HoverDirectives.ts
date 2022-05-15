import * as vscode from 'vscode';
import { CAhkDirectives } from '../../AhkSymbol/CAhkLine';
import { TAhkSymbolList, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { DirectivesMDMap } from '../../tools/Built-in/DirectivesList';

export function findDirectivesWithPos(
    AhkSymbolList: Readonly<TAhkSymbolList>,
    position: vscode.Position,
): undefined | CAhkDirectives {
    for (const ah of AhkSymbolList) {
        if (ah.range.contains(position)) {
            return ah instanceof CAhkDirectives
                ? ah
                : findDirectivesWithPos(ah.children, position);
        }
    }
    return undefined;
}

export function HoverDirectives(
    position: vscode.Position,
    AhkSymbolList: readonly TTopSymbol[],
): vscode.MarkdownString | undefined {
    const ah: CAhkDirectives | undefined = findDirectivesWithPos(AhkSymbolList, position);

    return ah !== undefined
        ? DirectivesMDMap.get(ah.hashtag)
        : undefined;
}
