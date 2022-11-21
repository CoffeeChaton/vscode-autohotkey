import type * as vscode from 'vscode';
import { CAhkInclude } from '../../../AhkSymbol/CAhkInclude';
import { CAhkDirectives } from '../../../AhkSymbol/CAhkLine';
import type { TAhkSymbolList, TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { DirectivesMDMap } from '../../../tools/Built-in/Directives';

function findDirectivesWithPos(
    AST: Readonly<TAhkSymbolList>,
    position: vscode.Position,
): CAhkDirectives | CAhkInclude | undefined {
    for (const ah of AST) {
        if (ah.range.contains(position)) {
            return ah instanceof CAhkDirectives || ah instanceof CAhkInclude
                ? ah
                : findDirectivesWithPos(ah.children, position);
        }
    }
    return undefined;
}

export function HoverDirectives(
    position: vscode.Position,
    AstRoot: TAstRoot,
): vscode.MarkdownString | undefined {
    const ah: CAhkDirectives | CAhkInclude | undefined = findDirectivesWithPos(AstRoot, position);

    return ah === undefined
        ? undefined
        : DirectivesMDMap.get(ah.hashtag);
}
