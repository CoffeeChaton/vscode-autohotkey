import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { pm } from '../../core/ProjectManager';
import type { TAllClassMap } from '../../tools/getAllClass';
import { getAllClass } from '../../tools/getAllClass';

function getClassRef(timeStart: number, wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b(${wordUp})\\b`, 'iug');
    const refFn = (lineStr: string): IterableIterator<RegExpMatchArray> => lineStr.matchAll(reg);

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
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
    console.log(`🚀 list all using of class "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 9~11ms (if not gc)
    return List;
}

export function getClassDef(
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const timeStart: number = Date.now();

    const classMap: TAllClassMap = getAllClass();
    const classDef: CAhkClass | undefined = classMap.get(wordUp);
    if (classDef === undefined) {
        return null;
    }

    if (!listAllUsing) {
        console.log(`🚀 goto def of class "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 0~1ms
        return [new vscode.Location(classDef.uri, classDef.selectionRange)];
    }

    return getClassRef(timeStart, wordUp);
}

// new CoI.__Tabs(tabs)
// class Coi {
//     class __Tabs {
//
//          __New(p){
//              this.p := p
//         }
//     }
// }
