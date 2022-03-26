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
export function setMD(
    prefix: EPrefix,
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
        .appendCodeblock(`${prefix} of ${funcName}()`) // TODO ahk_Hover_Doc_First_Line.tmLanguage.json ex param/local var
        .appendMarkdown(recStr)
        .appendMarkdown('use`f12` goto def    \n')
        .appendMarkdown(def)
        .appendMarkdown('   \n')
        .appendMarkdown('use`shift f12` goto ref    \n')
        .appendMarkdown(ref);
}

// icon https://code.visualstudio.com/api/references/icons-in-labels
