import * as vscode from 'vscode';
import { TGlobalVal, TGValMap, TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../../tools/str/removeSpecialChar';

function defGlobal(gValMapBySelf: TGValMap, strF: string, lStr: string, line: number): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const ma of strF.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gu)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;
        if ((/^_+$/u).test(rawName)) {
            // TODO
            console.log('🚀 ~TODO~ defGlobal ~ lStr', lStr);
            continue;
        }

        const ch: number = strF.indexOf(rawName, ma.index);

        const GValUpName: string = rawName.toUpperCase();

        const lRange: vscode.Range = new vscode.Range(
            new vscode.Position(line, ch),
            new vscode.Position(line, ch + rawName.length),
        );

        const GlobalVal: TGlobalVal = {
            lRange,
            rVal: null,
            rawName,
        };

        const oldVal: TGlobalVal[] = gValMapBySelf.get(GValUpName) ?? [];
        oldVal.push(GlobalVal);
        gValMapBySelf.set(GValUpName, oldVal);
    }
}

function refGlobal(gValMapBySelf: TGValMap, strF: string, lStr: string, line: number): void {
    for (const ma of strF.matchAll(/\s*([^,]+),?/uig)) {
        const rawName: string = ma[1].trim();
        if (rawName === '') continue;
        if ((/^_+$/u).test(rawName)) {
            // TODO
            console.log('🚀 ~TODO~ refGlobal ~ lStr', lStr);
            continue;
        }

        const ch: number = strF.indexOf(rawName, ma.index);

        const GValUpName: string = rawName.toUpperCase();

        const lRange: vscode.Range = new vscode.Range(
            new vscode.Position(line, ch),
            new vscode.Position(line, ch + rawName.length),
        );

        const GlobalVal: TGlobalVal = {
            lRange,
            rVal: null,
            rawName,
        };

        const oldVal: TGlobalVal[] = gValMapBySelf.get(GValUpName) ?? [];
        oldVal.push(GlobalVal);
        gValMapBySelf.set(GValUpName, oldVal);
    }
}

export function ahkGlobalMain(DocStrMap: TTokenStream, gValMapBySelf: TGValMap): void {
    for (
        const {
            fistWordUp,
            lStr,
            line,
            // textRaw,
        } of DocStrMap
    ) {
        if (fistWordUp !== 'GLOBAL') continue;
        if (lStr.trim() === 'GLOBAL') {
            // console.log('🚀 ~TODO~ ahkGlobalDef ~ lStr', lStr);
            // TODO global fn
            continue;
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        if (strF.indexOf(':=') > -1) {
            defGlobal(gValMapBySelf, strF, lStr, line);
        } else {
            refGlobal(gValMapBySelf, strF, lStr, line);
        }
    }
}

// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
