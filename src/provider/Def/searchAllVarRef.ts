import * as vscode from 'vscode';
import type { TValMetaOut } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';

export function searchAllVarRef(wordUp: string, byGlobalVar: boolean): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b(${wordUp})\\b`, 'giu');
    const refFn = (lineStr: string): IterableIterator<RegExpMatchArray> => lineStr.matchAll(reg);

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri, ModuleVar } of pm.getDocMapValue()) {
        if (byGlobalVar) {
            const v: TValMetaOut | undefined = ModuleVar.ModuleValMap.get(wordUp);
            if (v !== undefined) {
                for (const range of [...v.defRangeList, ...v.refRangeList]) {
                    List.push(
                        new vscode.Location(
                            uri,
                            range,
                        ),
                    );
                }
            }
        }
        for (const { line, lStr } of DocStrMap) {
            for (const ma of refFn(lStr)) {
                const col: number | undefined = ma.index;
                if (col === undefined) continue;

                List.push(
                    new vscode.Location(
                        uri,
                        new vscode.Range(
                            new vscode.Position(line, col),
                            new vscode.Position(line, col + wordUp.length),
                        ),
                    ),
                );
            }
        }
    }

    return List; // ssd -> 9~11ms (if not gc)
}
