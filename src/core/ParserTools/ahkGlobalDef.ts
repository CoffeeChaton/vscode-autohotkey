import * as vscode from 'vscode';
import {
    TGlobalVal,
    TGValMap,
} from '../../globalEnum';
import { replacerSpace } from '../../tools/str/removeSpecialChar';

// function getRVal(textRaw: string, ch: number, nameLen: number, ma2Len: number): string {
//     const position: number = ch + nameLen;
//     const start: number = textRaw.indexOf(':=', position) + 2; // ':='.len === 2
//     const rVal: string = textRaw.substring(start, start + ma2Len).trim();
//     return rVal;
// }

function defGlobal(gValMapBySelf: TGValMap, strF: string, line: number): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const ma of strF.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gu)) {
        const rawName: string = ma[1].trim();

        const ch: number = strF.indexOf(rawName, ma.index);

        const ValUpName: string = rawName.toUpperCase();

        const defRange: vscode.Range = new vscode.Range(
            new vscode.Position(line, ch),
            new vscode.Position(line, ch + rawName.length),
        );

        const oldVal: TGlobalVal | undefined = gValMapBySelf.get(ValUpName);

        if (oldVal) {
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

function refGlobal(gValMapBySelf: TGValMap, strF: string, line: number): void {
    for (const ma of strF.matchAll(/\s*([^,]+),?/uig)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;

        const ch: number = strF.indexOf(rawName, ma.index);

        const ValUpName: string = rawName.toUpperCase();

        const refRange: vscode.Range = new vscode.Range(
            new vscode.Position(line, ch),
            new vscode.Position(line, ch + rawName.length),
        );

        const oldVal: TGlobalVal | undefined = gValMapBySelf.get(ValUpName);

        if (oldVal) {
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

export function ahkGlobalMain(GValMap: TGValMap, fistWordUp: string, lStr: string, line: number): void {
    // self time 19ms
    // total 86 ms

    if (fistWordUp !== 'GLOBAL') return;
    if (lStr.trim() === 'GLOBAL') {
        // TODO global fn
        return;
    }

    const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

    if (strF.indexOf(':=') > -1) {
        defGlobal(GValMap, strF, line);
    } else {
        refGlobal(GValMap, strF, line);
    }
}

// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
