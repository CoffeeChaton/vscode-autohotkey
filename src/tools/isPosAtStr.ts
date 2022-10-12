import type * as vscode from 'vscode';

export function isPosAtStrNext(textRaw: string, lStr: string, position: vscode.Position): boolean {
    const col = position.character;
    if (col > lStr.length) {
        return true; // in ;comment
    }
    let tf = 1;
    const text = textRaw.replaceAll(/`./ug, '  ');
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
