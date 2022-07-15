import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { ELTrim } from '../../globalEnum';
import type { TSemanticTokensLeaf } from './tools';

// https://www.autohotkey.com/docs/Scripts.htm#continuation

export function inLTrimHighlight(DocStrMap: TTokenStream): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    for (const element of DocStrMap) {
        const { LTrim } = element;
        if (LTrim === ELTrim.FlagS || LTrim === ELTrim.noFlagS) {
            // ( LTrim Join    ; Comment.
            const { textRaw, line } = element;

            const CommentCol = textRaw.indexOf(';');
            const colEd = CommentCol === -1
                ? textRaw.length
                : CommentCol;

            Tokens.push({
                range: new vscode.Range(
                    new vscode.Position(line, textRaw.indexOf('(') + 1),
                    new vscode.Position(line, colEd),
                ),
                tokenType: 'keyword',
                tokenModifiers: [],
            });

            if (CommentCol !== -1) {
                Tokens.push({
                    range: new vscode.Range(
                        new vscode.Position(line, CommentCol),
                        new vscode.Position(line, textRaw.length),
                    ),
                    tokenType: 'comment',
                    tokenModifiers: [],
                });
            }
        }
    }

    return Tokens;
}

// TODO change color of ")" of line
// ) [v1.1.01+]: If a closing parenthesis appears in the continuation section's options (except as a parameter of the Join option)
// , the line is reinterpreted as an expression instead of the beginning of a continuation section.
// This allows expressions like (x.y)[z]() to work without the need to escape the opening parenthesis.

// ...TODO check keyword options
