/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import * as vscode from 'vscode';

export default function getFuncParm(document: vscode.TextDocument, AhkFunc: vscode.SymbolInformation, showParm: boolean): string {
    if (!showParm) return '';
    const paramBlockFinish = /\)\s*\{$/;
    const paramBlockFinish2 = /^\{/;
    const starLine = AhkFunc.location.range.start.line;
    const endLine = AhkFunc.location.range.end.line;
    let paramText = '';
    for (let line = starLine; line <= endLine; line += 1) {
        const { text } = document.lineAt(line);
        let textFix = text;
        const comment = textFix.lastIndexOf(';');
        if (comment > -1) textFix = textFix.substring(0, comment).trim();
        if (starLine === line) {
            const first = textFix.indexOf('(') + 1;
            if (first > -1) textFix = textFix.substr(first).trim();
        }
        paramText += textFix;
        if (textFix.search(paramBlockFinish) > -1 || textFix.search(paramBlockFinish2) > -1) break;
    }
    paramText = paramText.trim().replace(/\{$/, '');
    paramText = paramText.trim().replace(/\)$/, '').trim();
    return paramText;
}
