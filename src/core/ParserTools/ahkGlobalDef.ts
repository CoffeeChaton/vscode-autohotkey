import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../../tools/str/removeSpecialChar';
import type { TVarData } from './varMixedAnnouncement';
import { varMixedAnnouncement } from './varMixedAnnouncement';

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

type TUpName = string;
export type TGValMap = ReadonlyMap<TUpName, TGlobalVal>;
export type TGValMapReadOnly = ReadonlyMap<TUpName, Readonly<TGlobalVal>>;

export function ahkGlobalMain(DocStrMap: TTokenStream): TGValMap {
    const GValMap = new Map<TUpName, TGlobalVal>();
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
            if ((/^\s*\bGLOBAL$/ui).test(lStr)) continue;
            lastLineIsGlobal = true;
        } else if (lastLineIsGlobal && cll === 1) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
            continue;
        }

        const strF: string = lStr.replace(/^\s*\bglobal\b[,\s]+/ui, replacerSpace);

        const varDataList: TVarData[] = varMixedAnnouncement(strF);
        for (const { ch, rawName } of varDataList) {
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, ch),
                new vscode.Position(line, ch + rawName.length),
            );

            const ValUpName: string = rawName.toUpperCase();
            const oldVal: TGlobalVal | undefined = GValMap.get(ValUpName);

            if (oldVal !== undefined) {
                oldVal.defRangeList.push(range);
            } else {
                GValMap.set(ValUpName, {
                    defRangeList: [range],
                    refRangeList: [],
                    rawName,
                });
            }
        }
    }
    // for (const [k, v] of GValMap) {
    //     console.log('🚀 ~ ahkGlobalMain ~  [k, v]', { k, v });
    // }
    return GValMap;
}
