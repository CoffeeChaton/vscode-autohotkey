import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAllClassMap } from '../../tools/getAllClass';
import { getAllClass } from '../../tools/getAllClass';
import { searchAllVarRef } from './searchAllVarRef';

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
        ? searchAllVarRef(wordUp)
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
