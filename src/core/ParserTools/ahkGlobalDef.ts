import * as path from 'node:path';
import * as vscode from 'vscode';
import {
    EDetail,
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

export type TGlobalValReadonly = Readonly<TGlobalVal>;
export type TGValMapReadOnly = ReadonlyMap<TValUpName, TGlobalValReadonly>;

function getGRange(strF: string, rawName: string, ma: RegExpMatchArray, line: number): vscode.Range {
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
        const defRange: vscode.Range = getGRange(strF, rawName, ma, line);
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
        const refRange: vscode.Range = getGRange(strF, rawName, ma, line);
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
            detail,
            cll,
        } of DocStrMap
    ) {
        if (detail.includes(EDetail.isGlobalLine)) {
            lastLineIsGlobal = true;
        } else if (lastLineIsGlobal && cll === 1) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
            continue;
        }
        if (lStr.trim().toUpperCase() === 'GLOBAL') {
            continue; // TODO GLOBAL && nextLine
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        if (strF.includes(':=')) {
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

export function globalVal2Msg(fsPath: string, GlobalVal: TGlobalValReadonly): string {
    const fileName: string = path.basename(fsPath);
    const msg: string[] = [fileName];
    const { defRangeList, refRangeList } = GlobalVal;
    if (defRangeList.length > 0) {
        msg.push('- def');
        for (const range of defRangeList) {
            msg.push(range2Str(range));
        }
    }
    if (refRangeList.length > 0) {
        // don't show ref, because sometimes ref is not defined at this file...
        msg.push('- ref');
        for (const range of refRangeList) {
            msg.push(range2Str(range));
        }
    }

    return msg.join('\n\n');
}
// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
