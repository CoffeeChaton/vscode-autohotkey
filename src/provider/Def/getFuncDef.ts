import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { log } from '../vscWindows/log';
import { RefLike2Location } from './getFnRef';
import { isPosAtMethodName } from './isPosAtMethodName';
import { posAtFnRef } from './posAtFnRef';

export function getFuncDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const timeStart: number = Date.now();

    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;
    const { AST, DocStrMap } = AhkFileData;

    if (isPosAtMethodName(getDAWithPos(AST, position), position)) return null;

    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUp);
    if (funcSymbol === null) return null;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];

    if (
        !posAtFnRef({
            AhkTokenLine,
            document,
            position,
            wordUp,
        })
    ) {
        // c := c();
        // No   Yes check pos at like func()
        return null;
    }

    if (listAllUsing) {
        const locList: vscode.Location[] = RefLike2Location(funcSymbol);
        log.info(`list Ref of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`);
        return locList;
    }

    if (
        (funcSymbol.uri.fsPath === document.uri.fsPath
            && funcSymbol.nameRange.contains(position))
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(document.uri, funcSymbol.nameRange)]; // let auto use getReference
    }

    log.info(`goto def of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`); // ssd -> 0~1ms
    return [new vscode.Location(funcSymbol.uri, funcSymbol.selectionRange)];
}
