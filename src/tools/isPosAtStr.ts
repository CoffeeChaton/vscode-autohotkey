import * as vscode from 'vscode';
import { getLStr } from './removeSpecialChar';

export function isPosAtStr(document: vscode.TextDocument, position: vscode.Position): boolean {
    const col = position.character;
    const textRaw = document.lineAt(position.line).text;
    const lStr = getLStr(textRaw);
    if (col > lStr.length) {
        return true; // in ;comment
    }
    let tf = 1;
    const text = textRaw.replace(/`./g, '  ');
    const sL = text.length;
    for (let i = 0; i < sL; i++) {
        if (col === i) return tf !== 1;
        switch (text[i]) {
            case '"':
                tf *= -1;
                break;
            default:
                break;
        }
    }
    return false; // at line end
}
