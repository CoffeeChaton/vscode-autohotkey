import * as vscode from 'vscode';
import { EStr, TArgMap } from '../../../globalEnum';

export function getArgCompletion(
    argMap: TArgMap,
    funcName: string,
    suggestList: Set<string>,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    argMap.forEach((v) => {
        const { keyRawName } = v;
        const isSuggest = suggestList.has(keyRawName);
        const label = isSuggest
            ? `${EStr.suggestStr} ${keyRawName}`
            : keyRawName;

        const item = new vscode.CompletionItem(label);
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = keyRawName;
        item.detail = 'arg (neko-help-DeepAnalysis)';
        // if (isSuggest) {
        //     const sortText = String.fromCharCode(0) + String.fromCharCode(1);
        //     item.sortText = sortText;
        // }

        const ref: string = v.refLoc
            .map((loc): string => `line ${loc.range.start.line + 1}, col ${loc.range.start.character + 1}  `)
            .join('\n');

        const def: string = v.defLoc
            .map((loc): string => `line ${loc.range.start.line + 1}, col ${loc.range.start.character + 1}  `)
            .join('\n');

        const md = new vscode.MarkdownString('', true)
            .appendCodeblock(`arg of ${funcName}()`)
            .appendMarkdown('use`f12` goto def    \n')
            .appendMarkdown(def)
            .appendMarkdown('   \n')
            .appendMarkdown('use`shift f12` goto ref    \n')
            .appendMarkdown(ref);

        item.documentation = md;
        need.push(item);
    });
    return need;
}
