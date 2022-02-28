import * as vscode from 'vscode';
import { ESnippetRecBecause } from '../globalEnum';

export function setMD(
    prefix: string,
    refLoc: vscode.Location[],
    defLoc: vscode.Location[],
    funcName: string,
    recStr: ESnippetRecBecause | null,
): vscode.MarkdownString {
    const def: string = defLoc
        .map((loc): string => `line ${loc.range.start.line + 1}, col ${loc.range.start.character + 1}  `)
        .join('\n');

    const ref: string = refLoc
        .map((loc): string => `line ${loc.range.start.line + 1}, col ${loc.range.start.character + 1}  `)
        .join('\n');

    return new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`)
        .appendMarkdown(recStr ?? '')
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(def)
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(ref);
}
