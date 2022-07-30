/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,10] }] */
import * as vscode from 'vscode';
import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { wrapFnValDef } from './wrapFnValDef';

function wrap(arg: TGetFnDefNeed, character: number, RawName: string): void {
    const {
        line,
        valMap,
        paramMap,
        GValMap,
        comment,
    } = arg;

    const UpName: string = RawName.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return;

    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    const value: TValMetaIn = wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
        lineComment: comment,
    });
    valMap.set(UpName, value);
}

// For var1,var2 in Range
export function forLoop(arg: TGetFnDefNeed): void {
    const {
        lStrTrimLen,
        lStr,
    } = arg;

    if (lStrTrimLen < 10) return; // for a in b ----> len 10

    const col1: number = lStr.search(/\bFor\b\s/ui);
    if (col1 === -1) return;
    const col2: number = lStr.search(/\sin\s/ui); // (?:\s)in
    if (col2 === -1 || col1 >= col2) return;

    const replaceFor: number = col1 + 4; // 'for '.len = 4

    const strPart: string = lStr.slice(replaceFor, col2);
    const keyMatch: RegExpMatchArray | null = strPart.match(/\s*(\w+)[,\s]/ui);
    if (keyMatch === null) return;

    const keyPos: number = replaceFor + keyMatch[0].lastIndexOf(keyMatch[1]);
    wrap(arg, keyPos, keyMatch[1]);

    const col3: number = strPart.indexOf(',');
    if (col3 === -1) return;
    // has value

    const replaceComma: number = col3 + 1;
    const valMatch: RegExpMatchArray | null = strPart.slice(replaceComma).match(/\s*(\w+)\b/ui);
    if (valMatch === null) return;

    const valuePos: number = replaceFor + replaceComma + valMatch[0].lastIndexOf(valMatch[1]);
    wrap(arg, valuePos, valMatch[1]);
}
