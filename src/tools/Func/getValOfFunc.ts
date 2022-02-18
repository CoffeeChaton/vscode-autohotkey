import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { DeepReadonly, EMode, TAhkSymbol } from '../../globalEnum';
import { kindCheck } from '../../provider/Def/kindCheck';
import { getCommentOfLine } from '../getCommentOfLine';
import { Pretreatment } from '../Pretreatment';
import { removeParentheses } from '../removeParentheses';

export type ValDefOfFunc = DeepReadonly<{
    name: string;
    comment: string;
    line: number;
    textRaw: string;
    textRawFix: string;
}>;
export type ValDefOfFuncArr = readonly ValDefOfFunc[];

function getValAssignOfFunc(document: vscode.TextDocument, wordUp: string, ahkSymbol: TAhkSymbol): ValDefOfFuncArr {
    const bodyRange = new vscode.Range(ahkSymbol.selectionRange.end, ahkSymbol.range.end);
    const startLineBaseZero = bodyRange.start.line;
    const DocStrMap = Pretreatment(document.getText(bodyRange).split('\n'), startLineBaseZero);
    const lineStart = bodyRange.start.line + 0;
    const iMax = DocStrMap.length;
    const arr: ValDefOfFunc[] = [];
    for (let linePos = 0; linePos < iMax; linePos++) {
        const { textRaw, lStr } = DocStrMap[linePos];
        if (
            lStr.indexOf(':=') === -1
            && !(/^\s*static\s+\w/ui).test(lStr)
            && !(/^\s*global\s+\w/ui).test(lStr)
            && !(/^\s*local\s+\w/ui).test(lStr)
        ) {
            continue;
        }
        const line = lineStart + linePos;

        const comment = getCommentOfLine({ lStr, textRaw }) ?? '';
        const lStrFix = removeParentheses(lStr);
        lStrFix.replace(/^\s*static\b/ui, '')
            .replace(/^\s*global\b/ui, '')
            .replace(/^\s*local\b/ui, '')
            .trim()
            .split(',')
            .map((str) => str.trim())
            .filter((str) => str.toUpperCase().startsWith(wordUp))
            .map((str) => str.replace(/:=.*/u, '').trim())
            .filter((v) => !(/[%.[\]]/u).test(v))
            .forEach((name) => {
                const col = Math.max(0, lStr.indexOf(name));
                arr.push({
                    name,
                    comment,
                    line,
                    textRaw,
                    textRawFix: textRaw.substring(col, textRaw.length),
                });
            });
    }
    return arr;
}

function getArgsOfFunc(document: vscode.TextDocument, wordUp: string, ahkSymbol: TAhkSymbol): ValDefOfFuncArr {
    const { selectionRange } = ahkSymbol;
    const startLineBaseZero = selectionRange.start.line;
    const DocStrMap = Pretreatment(document.getText(selectionRange).split('\n'), startLineBaseZero);
    const lineStart = selectionRange.start.line + 0;
    const iMax = DocStrMap.length;
    const arr: ValDefOfFunc[] = [];
    for (let linePos = 0; linePos < iMax; linePos++) {
        const line = lineStart + linePos;
        const { textRaw, lStr } = DocStrMap[linePos];
        const comment = getCommentOfLine({ lStr, textRaw }) ?? '';
        lStr
            .replace(/^\s*\w+\(\s*/u, '')
            .replace(/\)\s*$/u, '')
            .trim()
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.toUpperCase().startsWith(wordUp)) // TODO FIX startsWith OR ===
            .forEach((v) => {
                const name = v.replace(/:=.*/u, '').trim();
                arr.push({
                    name,
                    comment,
                    line,
                    textRaw,
                    textRawFix: textRaw,
                });
            });
    }
    return arr;
}

export function getFuncSymbolOfPos(document: vscode.TextDocument, position: vscode.Position): TAhkSymbol | null {
    const ahkSymbolS = Detecter.getDocMap(document.uri.fsPath);
    if (ahkSymbolS === null) return null;

    return ahkSymbolS.find((s) => (kindCheck(EMode.ahkFunc, s.kind) && s.range.contains(position))) || null;
}

export function getValOfFunc(document: vscode.TextDocument, position: vscode.Position, wordUp: string): {
    readonly argItemS: ValDefOfFuncArr;
    readonly valAssignItemS: ValDefOfFuncArr;
} | null {
    const ahkSymbol = getFuncSymbolOfPos(document, position);
    if (ahkSymbol === null) return null;

    const argItemS = getArgsOfFunc(document, wordUp, ahkSymbol);
    const valAssignItemS = getValAssignOfFunc(document, wordUp, ahkSymbol);
    return { argItemS, valAssignItemS } as const;
}
