/* eslint-disable newline-per-chained-call */
/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';

export function contextCompletionItem(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    if (position.line === 0) return [];
    const textRaw = document.getText(new vscode.Range(new vscode.Position(position.line - 1, 0), new vscode.Position(position.line, 0)));
    if (textRaw.indexOf(':=') === -1) return [];

    const col = textRaw.search(/\S/);
    const HeadSpace = textRaw.substring(0, col);
    const HeadSpaceDBL = HeadSpace + HeadSpace;

    return [...textRaw.matchAll(/(\w\w*)\s*:=/g)]
        .map((value) => {
            const val = value[1]; // (\w\w*)
            const swH = position.character < val.length ? HeadSpace : '';
            const item = new vscode.CompletionItem(`${val} of Switch Case`, vscode.CompletionItemKind.Property);
            item.insertText = new vscode.SnippetString(swH).appendText(`Switch ${val}`).appendText(' {\n')
                .appendText(HeadSpaceDBL).appendText('case ').appendPlaceholder('CaseValue1').appendText(':\n\n')
                .appendText(HeadSpaceDBL).appendText('case ').appendPlaceholder('CaseValue2').appendText(':\n\n')
                // eslint-disable-next-line max-len
                .appendText(HeadSpaceDBL).appendText('case ').appendPlaceholder('CaseValue3').appendText(', ').appendPlaceholder('CaseValue4').appendText(':\n\n')
                .appendText(HeadSpaceDBL).appendText('default :\n\n')
                .appendText(HeadSpace).appendText('}');
            item.detail = 'neko help';
            item.documentation = 'context CompletionItem';
            item.preselect = true;
            item.sortText = String.fromCharCode(0) + String.fromCharCode(0);
            return item;
        });
}
