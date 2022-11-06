import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMetaOut,
    TValMetaOut,
} from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TModuleVar } from '../../tools/DeepAnalysis/getModuleVarMap';
import { searchAllVarRef } from './searchAllVarRef';

function rangeList2LocList(rangeList: readonly vscode.Range[], uri: vscode.Uri): vscode.Location[] {
    return rangeList.map((range) => new vscode.Location(uri, range));
}

function metaRangeList(
    defRangeList: readonly vscode.Range[],
    refRangeList: readonly vscode.Range[],
    listAllUsing: boolean,
    position: vscode.Position,
    uri: vscode.Uri,
): vscode.Location[] {
    if (listAllUsing) {
        return rangeList2LocList([...defRangeList, ...refRangeList], uri);
    }

    return defRangeList[0].contains(position)
        ? [new vscode.Location(uri, position)]
        : rangeList2LocList(defRangeList, uri);
}

function getModuleVarDef(
    ModuleVar: TModuleVar,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
    uri: vscode.Uri,
): vscode.Location[] | null {
    const valMeta: TValMetaOut | undefined = ModuleVar.ModuleValMap.get(wordUp);
    if (valMeta !== undefined) {
        if (listAllUsing) {
            return searchAllVarRef(wordUp);
        }

        const { defRangeList } = valMeta;
        return defRangeList[0].contains(position)
            ? [new vscode.Location(uri, position)]
            : rangeList2LocList(defRangeList, uri);
    }

    return null;
}

export function getValDefInFunc(
    AhkFileData: TAhkFileData,
    uri: vscode.Uri,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { AST, ModuleVar } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA === null) return getModuleVarDef(ModuleVar, position, wordUp, listAllUsing, uri);

    if (DA.nameRange.contains(position)) return null; // fnName === val

    const { paramMap, valMap } = DA;
    const argMeta: TParamMetaOut | undefined = paramMap.get(wordUp);
    if (argMeta !== undefined) {
        const { defRangeList, refRangeList } = argMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const valMeta: TValMetaOut | undefined = valMap.get(wordUp);
    if (valMeta !== undefined) {
        const { defRangeList, refRangeList } = valMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    return getModuleVarDef(ModuleVar, position, wordUp, listAllUsing, uri);
}
