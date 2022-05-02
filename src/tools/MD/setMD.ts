import * as vscode from 'vscode';
import { ESnippetRecBecause } from '../../provider/CompletionItem/DA/ESnippetRecBecause';

export const enum EPrefix {
    var = 'var',
    Param = 'Param',
    ByRefVariadicParam = 'ByRef Variadic Param',
    ByRefParam = 'ByRef Param',
    VariadicParam = 'Variadic Param',
    unKnownText = 'unKnownText',
}

function RangeList2Str(RangeList: readonly vscode.Range[]): string {
    return RangeList
        .map((range: vscode.Range): string => `line ${range.start.line + 1}, col ${range.start.character + 1}  `)
        .join('\n');
}

export function setMD(
    prefix: EPrefix,
    refRangeList: readonly vscode.Range[],
    defRangeList: readonly vscode.Range[],
    funcName: string,
    recStr: ESnippetRecBecause | '',
): vscode.MarkdownString {
    return new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`)
        .appendMarkdown(recStr)
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(RangeList2Str(defRangeList))
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(RangeList2Str(refRangeList));
}

// icon https://code.visualstudio.com/api/references/icons-in-labels
