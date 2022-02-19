import * as vscode from 'vscode';
import { TArgMap } from '../../globalEnum';

export function getArgCompletion(
    argMap: TArgMap,
    funcName: string,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    argMap.forEach((v) => {
        const item = new vscode.CompletionItem(v.keyRawName);
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = v.keyRawName;
        item.detail = 'arg (neko-help-DeepAnalysis)';

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
