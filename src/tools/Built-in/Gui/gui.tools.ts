/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as vscode from 'vscode';
import { getCommandOptions } from '../../../configUI';
import { ECommandOption } from '../../../configUI.data';
import { enumLog } from '../../enumErr';
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
            label: `Gui, ${SubCommand}`, // Left
            description: 'Gui-sub-command', // Right
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

export function getSnippetGui(subStr: string): readonly vscode.CompletionItem[] {
    const isOK: boolean = (/^G\w*$/iu).test(subStr)
        || (/^case\s[^:]+:\s*G\w*$/iu).test(subStr)
        || (/^default\s*:\s*G\w*$/iu).test(subStr)
        || (/::\s*G\w*$/iu).test(subStr); // allow hotstring or hotkey

    if (!isOK) return [];

    //
    const opt: ECommandOption = getCommandOptions();

    switch (opt) {
        case ECommandOption.All:
        case ECommandOption.Recommended:
            return snippetGui;

        case ECommandOption.noSameFunc:
            return snippetGui;

        case ECommandOption.notProvided:
            return [];

        default:
            enumLog(opt, getSnippetGui.name);
            return [];
    }
}

// function getGuiSubCmdDoc(
//     DocStrMap: TTokenStream,
//     position: vscode.Position,
// ): vscode.MarkdownString | undefined {
//     const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
//     const {
//         fistWordUp,
//         fistWordUpCol,
//         SecondWordUp,
//         SecondWordUpCol,
//     } = AhkTokenLine;

//     // eslint-disable-next-line no-nested-ternary
//     const col: number = fistWordUp === 'GUI'
//         ? fistWordUpCol
//         : (SecondWordUp === 'GUI'
//             ? SecondWordUpCol
//             : 0);

//     if (col === 0) return undefined;

//     if (position.character < col + 'gui,'.length) return undefined;
//     //
//     console.log('🚀 ~ position', position);

//     return undefined;
// }
