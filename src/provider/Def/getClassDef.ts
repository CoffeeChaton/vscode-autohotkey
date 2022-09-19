import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAllClassMap } from '../../tools/getAllClass';
import { getAllClass } from '../../tools/getAllClass';

export function getClassDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { uri } = document;
    const AhkFileData: TAhkFileData = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
    const { AST } = AhkFileData;

    const classMap: TAllClassMap = getAllClass();
    const classDef: CAhkClass | undefined = classMap.get(wordUp);
    if (classDef === undefined) {
        return null;
    }

    return listAllUsing
        ? null // TODO list all references
        : [new vscode.Location(classDef.uri, classDef.selectionRange)];
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
