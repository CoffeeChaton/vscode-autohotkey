import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { OutputChannel } from '../vscWindows/OutputChannel';

export type TFnFindCol = (AhkTokenLine: TAhkTokenLine, partTextRaw: string) => number[];

function getFuncReferenceCore(
    refFn: TFnFindCol,
    AhkFileData: TAhkFileData,
    wordUpLen: number,
): readonly vscode.Location[] {
    const List: vscode.Location[] = [];
    const { DocStrMap, AST, uri } = AhkFileData;
    const filterLineList: number[] = getDAListTop(AST)
        .filter((DA: CAhkFunc): boolean => DA.kind === vscode.SymbolKind.Method)
        .map((DA: CAhkFunc): number => DA.nameRange.start.line);

    for (const AhkTokenLine of DocStrMap) {
        const { textRaw, line, lStr } = AhkTokenLine;

        if (/* lStr.trim().length === 0 || */ filterLineList.includes(line)) {
            continue;
        }

        for (const col of refFn(AhkTokenLine, textRaw.slice(0, lStr.length))) {
            if (col === -1) {
                continue;
            }

            const Location: vscode.Location = new vscode.Location(
                uri,
                new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + wordUpLen),
                ),
            );
            List.push(Location);
        }
    }

    return List;
}

type TMap = Map<string, readonly vscode.Location[]>;
const wm = new WeakMap<TAhkFileData, TMap>();

export function getFuncReference(refFn: TFnFindCol, timeStart: number, funcSymbolName: string): vscode.Location[] {
    const wordUp: string = funcSymbolName.toUpperCase();
    const wordUpLen: number = wordUp.length;
    const allList: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const oldMap: TMap = wm.get(AhkFileData) ?? new Map<string, readonly vscode.Location[]>();

        const oldList: readonly vscode.Location[] | undefined = oldMap.get(wordUp);
        if (oldList !== undefined) {
            allList.push(...oldList);
            continue;
        }

        //
        const list: readonly vscode.Location[] = getFuncReferenceCore(refFn, AhkFileData, wordUpLen);
        allList.push(...list);

        oldMap.set(wordUp, list);
        wm.set(AhkFileData, oldMap);
    }
    OutputChannel.appendLine(`find Ref of ${funcSymbolName}() , use ${Date.now() - timeStart} ms`);
    return allList;
}
