import * as vscode from 'vscode';
import { A_Send } from '../../tools/Built-in/sendSpecialKeys';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getLStr } from '../../tools/str/removeSpecialChar';

const sendBigBlock: vscode.CompletionItem[] = [];

function ahkSendLazy(): vscode.CompletionItem[] {
    // normal
    if (sendBigBlock.length > 0) return sendBigBlock;
    // First loading
    for (const v of Object.values(A_Send)) {
        const {
            label,
            icon,
            doc,
            insertText,
            uri,
        } = v;
        const item = new vscode.CompletionItem({
            label, // Left
            description: icon, // Right
        });
        item.kind = vscode.CompletionItemKind.Text;
        item.insertText = insertText;
        item.detail = '{Special Keys} (neko-help)'; // description
        item.documentation = new vscode.MarkdownString('', true)
            .appendCodeblock(label, 'ahk')
            .appendMarkdown(doc.join('\n\n'))
            .appendMarkdown('\n\n')
            .appendMarkdown(`[Read Doc](${uri})`);
        sendBigBlock.push(item);
    }
    Object.freeze(sendBigBlock);
    return sendBigBlock;
}

// Delay loading
ahkSendLazy();

export function ahkSend(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const textRaw = document.lineAt(position).text;
    const lStr = getLStr(textRaw);
    if (
        (/\b(?:Control)?Send(?:Input|Play|Event)?\b/ui).test(lStr)
        || lStr.indexOf('::') > -1
        || isPosAtStr(document, position)
    ) {
        return ahkSendLazy();
    }
    return [];
}

// TODO send https://www.autohotkey.com/docs/commands/Send.htm#keynames
