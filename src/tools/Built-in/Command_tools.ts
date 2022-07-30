import * as vscode from 'vscode';
import type { TCommandElement } from './Command';
import { LineCommand } from './Command';

function commandElement2Md(Element: TCommandElement): vscode.MarkdownString {
    const {
        keyRawName,
        body,
        doc,
        link, // string | undefined
        exp, // string[] | undefined
    } = Element;
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
    if (exp !== undefined && exp.length > 0) {
        md.appendCodeblock(exp.join('\n'), 'ahk');
    }
    md.supportHtml = true;
    return md;
}

type TCommandMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TSnippetCommand = readonly vscode.CompletionItem[];

export const [snippetCommand, CommandMDMap] = ((): [TSnippetCommand, TCommandMDMap] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(LineCommand)) {
        const md = commandElement2Md(v);
        map1.set(k, md);

        const { keyRawName, body, recommended } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: 'Command',
        });
        item.kind = vscode.CompletionItemKind.Field; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Command of AHK (neko-help)'; // description
        item.documentation = md;

        if (recommended !== undefined && !recommended) {
            item.tags = [vscode.CompletionItemTag.Deprecated];
        }

        tempList.push(item);
    }
    return [tempList, map1];
})();

export function getSnippetCommand(lStr: string, position: vscode.Position): readonly vscode.CompletionItem[] {
    const subStr = lStr.slice(0, position.character).trim();

    return (/^\w*$/ui).test(subStr)
        ? snippetCommand
        : [];
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
