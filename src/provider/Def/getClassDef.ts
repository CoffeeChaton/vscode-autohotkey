import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { searchClassNameBreak } from '../../tools/searchClassNameBreak';
import { searchAllVarRef } from './searchAllVarRef';

export function getClassDef(
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const classDef: CAhkClass | null = searchClassNameBreak(wordUp);
    if (classDef === null) {
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
