import * as vscode from 'vscode';
import { isPosAtStr } from '../isPosAtStr';
import { getLStr } from '../str/removeSpecialChar';
import { A_Send } from './Send';

const sendBigBlock: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const list: vscode.CompletionItem[] = [];
    for (const v of Object.values(A_Send)) {
        const {
            label,
            icon,
            doc,
            body: insertText,
            uri,
        } = v;
        const item = new vscode.CompletionItem({
            label, // Left
            description: icon, // Right
        });
        item.kind = vscode.CompletionItemKind.Text;
        item.insertText = insertText;
        item.detail = '{Special Keys} (neko-help)';
        item.documentation = new vscode.MarkdownString('', true)
            .appendCodeblock(label, 'ahk')
            .appendMarkdown(doc.join('\n\n'))
            .appendMarkdown('\n\n')
            .appendMarkdown(`[Read Doc](${uri})`);
        //
        list.push(item);
    }

    return list;
})();

export function ahkSend(document: vscode.TextDocument, position: vscode.Position): readonly vscode.CompletionItem[] {
    const textRaw = document.lineAt(position).text;
    const lStr = getLStr(textRaw);
    if (
        (/\b(?:Control)?Send(?:Input|Play|Event)?\b/ui).test(lStr)
        || lStr.includes('::')
        || isPosAtStr(document, position)
    ) {
        return sendBigBlock;
    }
    return [];
}

// TODO send Key names https://www.autohotkey.com/docs/commands/Send.htm#keynames
