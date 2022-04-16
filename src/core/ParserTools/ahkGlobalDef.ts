import * as path from 'path';
import * as vscode from 'vscode';
import {
    TTokenStream,
} from '../../globalEnum';
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
    // c502 list ?
};

export type TValUpName = string;
type TGValMapPrivacy = Map<TValUpName, TGlobalVal>;
export type TGValMap = ReadonlyMap<TValUpName, TGlobalVal>;

function getGRange(strF: string, rawName: string, ma: RegExpMatchArray, line: number): vscode.Range {
    const ch: number = strF.indexOf(rawName, ma.index);
    const refRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, ch),
        new vscode.Position(line, ch + rawName.length),
    );
    return refRange;
}

function defGlobal(gValMapBySelf: TGValMapPrivacy, strF: string, line: number): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const ma of strF.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gui)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;

        const ValUpName: string = rawName.toUpperCase();
        const defRange: vscode.Range = getGRange(strF, rawName, ma, line);
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

function refGlobal(gValMapBySelf: TGValMapPrivacy, strF: string, line: number): void {
    for (const ma of strF.matchAll(/\s*([^,]+),?/uig)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;

        const ValUpName: string = rawName.toUpperCase();
        const refRange: vscode.Range = getGRange(strF, rawName, ma, line);
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

export function ahkGlobalMain(DocStrMap: TTokenStream): TGValMap {
    const GValMap: TGValMapPrivacy = new Map<TValUpName, TGlobalVal>();
    for (const { lStr, line, fistWordUp } of DocStrMap) {
        if (fistWordUp !== 'GLOBAL') continue;
        if (lStr.trim() === 'GLOBAL') {
            // TODO global fn
            continue;
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        if (strF.indexOf(':=') > -1) {
            defGlobal(GValMap, strF, line);
        } else {
            refGlobal(GValMap, strF, line);
        }
    }
    return GValMap;
}

function range2Str(range: vscode.Range): string {
    const { line, character } = range.start;
    return `    ln ${line}, ch ${character}`; // -> md to ahk-lang
}

export function globalVal2Msg(fsPath: string, GlobalVal: TGlobalVal): string {
    const fileName: string = path.basename(fsPath);
    const msg: string[] = [fileName];
    msg.push('- def');
    for (const range of GlobalVal.defRangeList) {
        msg.push(range2Str(range));
    }
    msg.push('- ref');
    for (const range of GlobalVal.refRangeList) {
        msg.push(range2Str(range));
    }
    return msg.join('\n\n');
}
// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
