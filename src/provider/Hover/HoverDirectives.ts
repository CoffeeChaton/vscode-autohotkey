import * as vscode from 'vscode';
import { CAhkDirectives } from '../../AhkSymbol/CAhkLine';
import { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import { Detecter } from '../../core/Detecter';
import { DirectivesMDMap } from '../../tools/Built-in/DirectivesList';

export function findDirectivesWithPos(
    AhkSymbolList: TAhkSymbolList,
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
    fsPath: string,
    position: vscode.Position,
): vscode.MarkdownString | undefined {
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    const ah: CAhkDirectives | undefined = findDirectivesWithPos(AhkSymbolList, position);

    return ah !== undefined
        ? DirectivesMDMap.get(ah.hashtag)
        : undefined;
}
