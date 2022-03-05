import * as vscode from 'vscode';
import { ESnippetRecBecause } from '../../globalEnum';

export function setMD(
    prefix: string,
    refRangeList: vscode.Range[],
    defRangeList: vscode.Range[],
    funcName: string,
    recStr: ESnippetRecBecause | '',
): vscode.MarkdownString {
    const def: string = defRangeList
        .map((range): string => `line ${range.start.line + 1}, col ${range.start.character + 1}  `)
        .join('\n');

    const ref: string = refRangeList
        .map((range): string => `line ${range.start.line + 1}, col ${range.start.character + 1}  `)
        .join('\n');

    return new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`)
        .appendMarkdown(recStr)
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(def)
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(ref);
}

// icon https://code.visualstudio.com/api/references/icons-in-labels
