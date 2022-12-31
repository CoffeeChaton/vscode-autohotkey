/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { guiSubCommandList } from './gui.data';

const { snippetGui, GuiMDMap } = (() => {
    const MDMapRW = new Map<string, vscode.MarkdownString>();
    const snippetListRW: vscode.CompletionItem[] = [];

    for (const v of guiSubCommandList) {
        const {
            SubCommand,
            body,
            doc,
            link,
            exp,
        } = v;
        const upName: string = SubCommand.toUpperCase();
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('Gui')
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        MDMapRW.set(upName, md);

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `Gui${SubCommand}`, // Left
            description: 'Gui', // Right
        });
        item.kind = vscode.CompletionItemKind.Keyword;
        item.insertText = body;
        item.detail = 'Gui';
        item.documentation = md;

        snippetListRW.push(item);
    }

    /**
     * after initialization clear
     */
    guiSubCommandList.length = 0;

    // ---
    // ---
    return {
        snippetGui: snippetListRW as readonly vscode.CompletionItem[],
        GuiMDMap: MDMapRW as ReadonlyMap<string, vscode.MarkdownString>,
    };
})();

// export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
//     return CommandMDMap.get(wordUp);
// }
