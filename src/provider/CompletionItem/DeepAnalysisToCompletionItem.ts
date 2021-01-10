/* eslint-disable immutable/no-mutation */
import * as vscode from 'vscode';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { kindPick } from '../../tools/Func/kindPick';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { isPosAtStr } from '../../tools/isPosAtStr';

export function DeepAnalysisToCompletionItem(document: vscode.TextDocument, position: vscode.Position)
    : vscode.CompletionItem[] {
    if (isPosAtStr(document, position)) return [];

    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const kindStr = kindPick(ahkSymbol.kind);
    if (!kindStr) return [];

    const ed = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    const { argList, valList } = ed;
    const need: vscode.CompletionItem[] = [];
    argList.forEach((v, label) => {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Variable);
        item.insertText = label;
        item.detail = `arg of this ${kindStr} func (neko-help-DeepAnalysis)`;

        const md: vscode.MarkdownString = new vscode.MarkdownString('', true);
        md.appendCodeblock(`arg of this func (${ahkSymbol.name}()) `);
        md.appendMarkdown(v.commentList.join('\n'));
        v.refLoc.forEach((e) => md.appendCodeblock(`ref Pos Ln ${e.range.start.line + 1}, Col ${e.range.start.character + 1}`));

        item.documentation = md;
        need.push(item);
    });
    valList.forEach((v, label) => {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Variable);
        item.insertText = label;
        item.detail = `val this ${kindStr} (neko-help-DeepAnalysis)`;
        item.documentation = new vscode.MarkdownString(v.commentList.join('\n'));
        need.push(item);
    });

    return need;
}
