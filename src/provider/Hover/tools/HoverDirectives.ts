import type * as vscode from 'vscode';
import { CAhkDirectives } from '../../../AhkSymbol/CAhkLine';
import type { TAhkSymbolList, TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { DirectivesMDMap } from '../../../tools/Built-in/Directives';

function findDirectivesWithPos(
    AST: Readonly<TAhkSymbolList>,
    position: vscode.Position,
): CAhkDirectives | undefined {
    for (const ah of AST) {
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
    AstRoot: TAstRoot,
): vscode.MarkdownString | undefined {
    const ah: CAhkDirectives | undefined = findDirectivesWithPos(AstRoot, position);

    return ah !== undefined
        ? DirectivesMDMap.get(ah.hashtag)
        : undefined;
}
