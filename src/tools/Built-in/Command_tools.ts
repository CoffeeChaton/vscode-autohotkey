import * as vscode from 'vscode';
import type { TCommandElement } from './Command_Data';
import { LineCommand } from './Command_Data';

function commandElement2Md(DirectivesElement: TCommandElement): vscode.MarkdownString {
    const {
        keyRawName,
        body,
        doc,
        link,
        exp,
    } = DirectivesElement;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('Command')
        .appendCodeblock(keyRawName, 'ahk')
        .appendCodeblock(body, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link ?? 'https://www.autohotkey.com/docs/commands/index.htm'})`) // FIXME
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*');
    // .appendCodeblock(exp.join('\n'));
    if ((exp !== undefined) && exp.length > 0) {
        md.appendCodeblock(exp.join('\n'), 'ahk');
    }
    md.supportHtml = true;
    return md;
}

export const CommandMDMap: ReadonlyMap<string, vscode.MarkdownString> = new Map(
    [...Object.entries(LineCommand)]
        .map(([ukName, BiFunc]: [string, TCommandElement]) => [ukName, commandElement2Md(BiFunc)]),
);

const snippetCommand: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(LineCommand)) {
        const { keyRawName, body, recommended } = v;
        const label: vscode.CompletionItemLabel = {
            label: keyRawName,
            description: 'Command',
        };
        const item: vscode.CompletionItem = new vscode.CompletionItem(label);
        item.kind = vscode.CompletionItemKind.Field; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);

        item.detail = 'Command of AHK (neko-help)'; // description
        item.documentation = CommandMDMap.get(k) ?? commandElement2Md(v);

        if (recommended !== undefined && !recommended) {
            item.tags = [vscode.CompletionItemTag.Deprecated];
        }

        tempList.push(item);
    }
    return tempList;
})();

export function getSnippetCommand(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : snippetCommand;
}

export function getHoverCommand(
    fistWordUp: string,
    position: vscode.Position,
    lStr: string,
): vscode.MarkdownString | undefined {
    if (fistWordUp === '') return undefined;

    const { character } = position;
    const posS = lStr.length - lStr.trimStart().length;
    if (character < posS) return undefined;

    const posE = posS + fistWordUp.length;
    if (character > posE) return undefined;

    return CommandMDMap.get(fistWordUp);
}

export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
    return CommandMDMap.get(wordUp);
}
