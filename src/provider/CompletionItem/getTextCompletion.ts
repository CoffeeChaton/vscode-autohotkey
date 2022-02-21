import * as vscode from 'vscode';
import { TTextMap } from '../../globalEnum';

export function getTextCompletion(
    textMap: TTextMap,
    funcName: string,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    textMap.forEach((v) => {
        const item = new vscode.CompletionItem(v.keyRawName);
        item.kind = vscode.CompletionItemKind.Text;
        item.insertText = v.keyRawName;
        item.detail = 'unknown text (neko-help-DeepAnalysis)';

        const ref: string = v.refLoc
            .map((loc): string => `line ${loc.range.start.line + 1}, col ${loc.range.start.character + 1}  `)
            .join('\n');

        const md = new vscode.MarkdownString('', true)
            .appendCodeblock(`unknown text of ${funcName}()`)
            .appendMarkdown('use `shift f12` goto ref    \n')
            .appendMarkdown(ref);

        item.documentation = md;
        need.push(item);
    });

    return need;
}
