import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../../tools/str/removeSpecialChar';

// function getRVal(textRaw: string, ch: number, nameLen: number, ma2Len: number): string {
//     const position: number = ch + nameLen;
//     const start: number = textRaw.indexOf(':=', position) + 2; // ':='.len === 2
//     const rVal: string = textRaw.substring(start, start + ma2Len).trim();
//     return rVal;
// }

export type TGlobalVal = {
    defRangeList: vscode.Range[];
    refRangeList: vscode.Range[];
    rawName: string; // -> GVar
    // TODO c502 list ? until were?
    // TODO add ahk-doc ?
};

type TValUpName = string;
type TGValMapPrivacy = Map<TValUpName, TGlobalVal>;
export type TGValMap = ReadonlyMap<TValUpName, TGlobalVal>;

type TGlobalValReadonly = Readonly<TGlobalVal>;
export type TGValMapReadOnly = ReadonlyMap<TValUpName, TGlobalValReadonly>;

function setRangeGlobal(strF: string, rawName: string, ma: RegExpMatchArray, line: number): vscode.Range {
    const ch: number = strF.indexOf(rawName, ma.index);
    const refRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, ch),
        new vscode.Position(line, ch + rawName.length),
    );
    return refRange;
}

function defGlobal(gValMapBySelf: TGValMapPrivacy, strF: string, line: number): void {
    for (const ma of strF.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gui)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;

        const ValUpName: string = rawName.toUpperCase();
        const defRange: vscode.Range = setRangeGlobal(strF, rawName, ma, line);
        const oldVal: TGlobalVal | undefined = gValMapBySelf.get(ValUpName);

        if (oldVal !== undefined) {
            oldVal.defRangeList.push(defRange);
        } else {
            gValMapBySelf.set(ValUpName, {
                defRangeList: [defRange],
                refRangeList: [],
                rawName,
            });
        }
    }
}

function refGlobal(gValMapBySelf: TGValMapPrivacy, strF: string, line: number): void {
    for (const ma of strF.matchAll(/\s*([^,]+),?/uig)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;

        const ValUpName: string = rawName.toUpperCase();
        const refRange: vscode.Range = setRangeGlobal(strF, rawName, ma, line);
        const oldVal: TGlobalVal | undefined = gValMapBySelf.get(ValUpName);

        if (oldVal !== undefined) {
            oldVal.refRangeList.push(refRange);
        } else {
            gValMapBySelf.set(ValUpName, {
                defRangeList: [],
                refRangeList: [refRange],
                rawName,
            });
        }
    }
}

export function ahkGlobalMain(DocStrMap: TTokenStream): TGValMap {
    const GValMap: TGValMapPrivacy = new Map<TValUpName, TGlobalVal>();
    let lastLineIsGlobal = false;

    for (
        const {
            lStr,
            line,
            cll,
            fistWordUp,
        } of DocStrMap
    ) {
        if (fistWordUp === 'GLOBAL') {
            lastLineIsGlobal = true;
        } else if (lastLineIsGlobal && cll === 1) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
            continue;
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        if (strF.includes(':=')) {
            defGlobal(GValMap, strF, line);
        } else {
            refGlobal(GValMap, strF, line);
        }
    }
    // for (const [k, v] of GValMap) {
    //     console.log('🚀 ~ ahkGlobalMain ~  [k, v]', { k, v });
    // }
    return GValMap;
}

// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
