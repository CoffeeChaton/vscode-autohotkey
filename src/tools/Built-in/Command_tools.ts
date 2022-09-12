import * as vscode from 'vscode';
import type { TCommandElement } from './Command';
import { LineCommand } from './Command';
import { CSnippetCommand } from './CSnippetCommand';

function commandElement2Md(Element: TCommandElement): vscode.MarkdownString {
    const {
        body,
        doc,
        link, // string | undefined
        exp, // string[] | undefined
    } = Element;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('Command')
        .appendCodeblock(body, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link ?? 'https://www.autohotkey.com/docs/commands/index.htm'})`); // FIXME

    // .appendCodeblock(exp.join('\n'));
    if (exp !== undefined && exp.length > 0) {
        md
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
    }
    md.supportHtml = true;
    return md;
}

type TCommandMDMap = ReadonlyMap<string, vscode.MarkdownString>;
export type TSnippetCommand = readonly CSnippetCommand[];

export const [snippetCommand, CommandMDMap] = ((): [TSnippetCommand, TCommandMDMap] => {
    const map1 = new Map<string, vscode.MarkdownString>();
    const tempList: CSnippetCommand[] = [];
    for (const [k, v] of Object.entries(LineCommand)) {
        const md: vscode.MarkdownString = commandElement2Md(v);
        map1.set(k, md);

        tempList.push(new CSnippetCommand(k, v, md));
    }
    return [tempList, map1];
})();

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
