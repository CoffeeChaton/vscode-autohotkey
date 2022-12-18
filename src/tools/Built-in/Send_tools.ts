import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { isPosAtStrNext } from '../isPosAtStr';
import { A_Send } from './Send';

const sendBigBlock: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const list: vscode.CompletionItem[] = [];
    for (const v of Object.values(A_Send)) {
        const {
            label,
            icon,
            doc,
            body: insertText,
            link: uri,
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

export function ahkSend(AhkFileData: TAhkFileData, position: vscode.Position): readonly vscode.CompletionItem[] {
    const { DocStrMap } = AhkFileData;
    const { textRaw, lStr } = DocStrMap[position.line];
    if (
        (/\b(?:Control)?Send(?:Input|Play|Event)?\b/ui).test(lStr)
        || lStr.includes('::')
        || isPosAtStrNext(textRaw, lStr, position)
    ) {
        return sendBigBlock;
    }
    return [];
}
