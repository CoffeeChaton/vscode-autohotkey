import * as vscode from 'vscode';
import { ESnippetRecBecause } from '../../globalEnum';

export const enum EPrefix {
    var = 'var',
    Param = 'Param',
    ByRefVariadicParam = 'ByRef Variadic Param',
    ByRefParam = 'ByRef Param',
    VariadicParam = 'Variadic Param',
    unKnownText = 'unKnownText',
}

function RangeList2Str(RangeList: vscode.Range[]): string {
    return RangeList
        .map((range: vscode.Range): string => `line ${range.start.line + 1}, col ${range.start.character + 1}  `)
        .join('\n');
}

export function setMD(
    prefix: EPrefix,
    refRangeList: vscode.Range[],
    defRangeList: vscode.Range[],
    funcName: string,
    recStr: ESnippetRecBecause | '',
): vscode.MarkdownString {
    return new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`) // TODO ahk_Hover_Doc_First_Line.tmLanguage.json ex param/local var
        .appendMarkdown(recStr)
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(RangeList2Str(defRangeList))
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(RangeList2Str(refRangeList));
}

// icon https://code.visualstudio.com/api/references/icons-in-labels
