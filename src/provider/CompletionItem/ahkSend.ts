/* eslint-disable max-len */
/* eslint-disable max-lines */

import * as vscode from 'vscode';
// import * as vscLsp from 'vscode-languageserver';
// import { CompletionItem, MarkupKind, CompletionItemKind } from 'vscode-languageserver-types';

const sendBigBlock: vscode.CompletionItem[] = [
    'Blind',
    'Click',
    'Raw',
    'AltDown',
    'AltUp',
    'ShiftDown',
    'ShiftUp',
    'CtrlDown',
    'CtrlUp',
    'LWinDown',
    'LWinUp',
    'RWinDown',
    'RWinUp',
    'Enter',
    'Escape',
    'Esc',
    'Space',
    'Tab',
    'Text',
    'PrintScreen',
    'Click 100, 200, 0',
].map((e) => {
    const c = {
        label: `{${e}}`,
        insertText: e,
        kind: vscode.CompletionItemKind.Text,
        detail: 'neko help',
        documentation: 'CompletionItem of Send\n\nhttps://www.autohotkey.com/docs/commands/Send.htm',
    };
    return c;
});

export function ahkSend(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const newRange = new vscode.Range(position.line, position.character - 1, position.line, position.character);
    const newStr = document.getText(newRange).trim();
    if (newStr !== '{') return []; // just support {}

    const textRaw = document.lineAt(position).text;
    if ((/\b(?:Control)?Send(?:Input|Play|Event)?\b/i).test(textRaw) === false
        || textRaw.indexOf('::') === -1
        || (/InputHook\(/i).test(textRaw) === false) {
        return [];
    }
    if ((/\{Raw\}/i).test(textRaw)) return [];

    return sendBigBlock;
}
