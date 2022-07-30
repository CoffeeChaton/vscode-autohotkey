import * as vscode from 'vscode';
import type { ESnippetRecBecause } from '../../provider/CompletionItem/DA/ESnippetRecBecause';

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

type TSetMD = {
    prefix: EPrefix;
    refRangeList: readonly vscode.Range[];
    defRangeList: readonly vscode.Range[];
    funcName: string;
    recStr: ESnippetRecBecause | '';
    commentList: readonly string[];
};

export function setMD(
    {
        prefix,
        refRangeList,
        defRangeList,
        funcName,
        recStr,
        commentList,
    }: TSetMD,
): vscode.MarkdownString {
    const commentList2 = commentList.filter((v: string): boolean => v !== '');
    const commentListStr = commentList2.length > 0
        ? `---\n\n${commentList2.join('\n\n')}\n\n---\n\n`
        : '';

    return new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`)
        .appendMarkdown(recStr)
        .appendMarkdown(commentListStr)
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(RangeList2Str(defRangeList))
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(RangeList2Str(refRangeList));
}

// icon https://code.visualstudio.com/api/references/icons-in-labels
