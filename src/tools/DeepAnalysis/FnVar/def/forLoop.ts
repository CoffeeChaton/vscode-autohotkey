/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,15] }] */
import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../FnMetaType';
import { wrapFnValDef } from './wrapFnValDef';

function wrap(arg: TGetFnDefNeed, character: number, RawName: string): void {
    const {
        line,
        valMap,
        lineType,
    } = arg;
    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    const value: TValAnalysis = wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
        lineType,
    });
    valMap.set(RawName.toUpperCase(), value);
}

function setV1(
    arg: TGetFnDefNeed,
    ch: number,
    v0: string,
    v1: string,
): void {
    if (arg.argMap.has(v1.toUpperCase())) return;

    const character: number = ch + v0.indexOf(v1, 3);
    wrap(arg, character, v1);
}

function setV2(
    arg: TGetFnDefNeed,
    ch: number,
    v0: string,
    v2: string,
): void {
    if (arg.argMap.has(v2.toUpperCase())) return;

    const character: number = ch + v0.lastIndexOf(v2);
    wrap(arg, character, v2);
}

// For var1,var2 in Range
export function forLoop(arg: TGetFnDefNeed): void {
    const {
        lStr,
    } = arg;

    // eslint-disable-next-line no-magic-numbers
    if (lStr.trim().length < 10) return; // for a in b ----> len 10

    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?:\s|^)\bFor\b\s+(\w+)\s*(?:,\s*(\w+))?\s+in\s/giu)) {
        const ch: number | undefined = v.index;
        if (ch === undefined) continue;
        const v0: string = v[0];
        const v1: string = v[1];
        if (v1) setV1(arg, ch, v0, v1);

        const v2: string = v[2];
        if (v2) setV2(arg, ch, v0, v2);
    }
}
