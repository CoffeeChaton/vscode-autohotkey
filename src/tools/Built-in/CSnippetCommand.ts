import * as vscode from 'vscode';
import type { TCommandElement } from './Command';

export class CSnippetCommand extends vscode.CompletionItem {
    public readonly upName: string;
    public readonly recommended: boolean;
    public constructor(k: string, v: TCommandElement, md: vscode.MarkdownString) {
        const { keyRawName, body, recommended } = v;
        super({
            label: keyRawName,
            description: 'Command',
        }, vscode.CompletionItemKind.Keyword); // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        this.insertText = new vscode.SnippetString(body);
        this.detail = 'Command of AHK (neko-help)';
        this.documentation = md;
        this.upName = k;
        this.recommended = recommended ?? true; // TODO remove this undefined
    }
}
