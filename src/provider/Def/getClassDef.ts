import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { pm } from '../../core/ProjectManager';
import type { TAllClassMap } from '../../tools/getAllClass';
import { getAllClass } from '../../tools/getAllClass';

function getClassRef(wordUp: string): vscode.Location[] {
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

    return List; // ssd -> 9~11ms (if not gc)
}

export function getClassDef(
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const classMap: TAllClassMap = getAllClass();
    const classDef: CAhkClass | undefined = classMap.get(wordUp);
    if (classDef === undefined) {
        return null;
    }

    return listAllUsing
        ? getClassRef(wordUp)
        : [new vscode.Location(classDef.uri, classDef.selectionRange)]; // ssd -> 0~1 ms
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
