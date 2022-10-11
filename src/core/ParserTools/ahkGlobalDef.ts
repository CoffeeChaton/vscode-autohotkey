import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../../tools/str/removeSpecialChar';
import { varMixedAnnouncement } from './varMixedAnnouncement';

// function getRVal(textRaw: string, ch: number, nameLen: number, ma2Len: number): string {
//     const position: number = ch + nameLen;
//     const start: number = textRaw.indexOf(':=', position) + 2; // ':='.len === 2
//     const rVal: string = textRaw.substring(start, start + ma2Len).trim();
//     return rVal;
// }

type TGValData = {
    rawName: string;
    range: vscode.Range;
};

export type TGlobalVal = {
    defRangeList: TGValData[];
    refRangeList: TGValData[];
    // TODO c502 list ? until were?
    // TODO add ahk-doc ?
};

type TUpName = string;
export type TGValMap = ReadonlyMap<TUpName, TGlobalVal>;
export type TGValMapReadOnly = ReadonlyMap<TUpName, Readonly<TGlobalVal>>;

export function ahkGlobalMain(DocStrMap: TTokenStream): TGValMap {
    const GValMap = new Map<TUpName, TGlobalVal>();
    let lastLineIsGlobal = false;
    let objDeepRaw = 0;
    for (
        const {
            lStr,
            line,
            cll,
            fistWordUp,
        } of DocStrMap
    ) {
        if (fistWordUp === 'GLOBAL') {
            if ((/^\s*\bGLOBAL$/ui).test(lStr)) continue;
            lastLineIsGlobal = true;
            objDeepRaw = 0;
        } else if (lastLineIsGlobal && cll === 1) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
            continue;
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        const { varDataList, objDeep } = varMixedAnnouncement(strF, objDeepRaw);
        objDeepRaw = objDeep;
        for (const { ch, rawName } of varDataList) {
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, ch),
                new vscode.Position(line, ch + rawName.length),
            );

            const ValUpName: string = rawName.toUpperCase();
            const oldVal: TGlobalVal | undefined = GValMap.get(ValUpName);
            const element: TGValData = {
                rawName,
                range,
            };

            if (oldVal !== undefined) {
                oldVal.defRangeList.push(element);
            } else {
                GValMap.set(ValUpName, {
                    defRangeList: [element],
                    refRangeList: [],
                });
            }
        }
    }
    // for (const [k, v] of GValMap) {
    //     console.log('🚀 ~ ahkGlobalMain ~  [k, v]', { k, v });
    // }
    return GValMap;
}
