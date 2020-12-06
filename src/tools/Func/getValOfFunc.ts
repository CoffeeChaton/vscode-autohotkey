/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { EMode, MyDocSymbol, DeepReadonly } from '../../globalEnum';
import { kindCheck } from '../../provider/Def/kindCheck';
import { getCommentOfLine } from '../getCommentOfLine';
import { Pretreatment } from '../Pretreatment';
import { removeParentheses } from '../removeParentheses';

export type ValDefOfFunc = DeepReadonly<{ name: string, comment: string, line: number, textRaw: string, textRawFix: string }>;
export type ValDefOfFuncArr = readonly ValDefOfFunc[];

function getValAssignOfFunc(document: vscode.TextDocument, wordLower: string, ahkSymbol: MyDocSymbol): ValDefOfFuncArr {
    const bodyRange = new vscode.Range(ahkSymbol.selectionRange.end, ahkSymbol.range.end);
    const DocStrMap = Pretreatment(document.getText(bodyRange).split('\n'));
    const lineStart = bodyRange.start.line + 0;
    const iMax = DocStrMap.length;
    const arr: ValDefOfFunc[] = [];
    for (let linePos = 0; linePos < iMax; linePos++) {
        const { textRaw, lStr } = DocStrMap[linePos];
        if (lStr.indexOf(':=') === -1
            && (/^\s*static\s\s*\w/i).test(lStr) === false
            && (/^\s*global\s\s*\w/i).test(lStr) === false
            && (/^\s*local\s\s*\w/i).test(lStr) === false
        ) {
            continue;
        }
        const line = lineStart + linePos;

        const comment = getCommentOfLine({ textRaw, lStr });
        const lStrFix = removeParentheses(lStr);
        lStrFix.replace(/^\s*static\b/i, '')
            .replace(/^\s*global\b/i, '')
            .replace(/^\s*local\b/i, '')
            .trim()
            .split(',')
            .map((str) => str.trim())
            .filter((str) => str.toLowerCase().startsWith(wordLower))
            .map((str) => str.replace(/:=.*/, '').trim())
            .filter((v) => !(/[%.[\]]/).test(v))
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

function getArgsOfFunc(document: vscode.TextDocument, wordLower: string, ahkSymbol: MyDocSymbol): ValDefOfFuncArr {
    const { selectionRange } = ahkSymbol;
    const DocStrMap = Pretreatment(document.getText(selectionRange).split('\n'));
    const lineStart = selectionRange.start.line + 0;
    const iMax = DocStrMap.length;
    const arr: ValDefOfFunc[] = [];
    for (let linePos = 0; linePos < iMax; linePos++) {
        const line = lineStart + linePos;
        const { textRaw, lStr } = DocStrMap[linePos];
        const comment = getCommentOfLine({ textRaw, lStr });
        lStr.replace(/^\s*\w\w*\(\s*/, '').replace(/\)\s*$/, '').trim()
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.toLowerCase().startsWith(wordLower)) // TODO FIX startsWith OR ===
            .forEach((v) => {
                const name = v.replace(/:=.*/, '').trim();
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

export function getFuncSymbolOfPos(document: vscode.TextDocument, position: vscode.Position): MyDocSymbol | null {
    const ahkSymbolS = Detecter.getDocMap(document.uri.fsPath);
    if (ahkSymbolS === undefined) return null;

    return ahkSymbolS.find((s) => (kindCheck(EMode.ahkFunc, s.kind) && s.range.contains(position))) || null;
}

export function getValOfFunc(document: vscode.TextDocument, position: vscode.Position, wordLower: string): {
    readonly argItemS: ValDefOfFuncArr;
    readonly valAssignItemS: ValDefOfFuncArr;
} | null {
    const ahkSymbol = getFuncSymbolOfPos(document, position);
    if (ahkSymbol === null) return null;

    const argItemS = getArgsOfFunc(document, wordLower, ahkSymbol);
    const valAssignItemS = getValAssignOfFunc(document, wordLower, ahkSymbol);
    return { argItemS, valAssignItemS } as const;
}
