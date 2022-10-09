import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMetaOut,
    TTextMetaOut,
    TValMetaOut,
} from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TModuleVar } from '../../tools/DeepAnalysis/getModuleVarMap';

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
    if (!ModuleVar.allowList[position.line]) return null;

    const { ModuleValMap, ModuleTextMap } = ModuleVar;

    const valMeta: TValMetaOut | undefined = ModuleValMap.get(wordUp);
    if (valMeta !== undefined) {
        const { defRangeList, refRangeList } = valMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const textList: TTextMetaOut | undefined = ModuleTextMap.get(wordUp);
    return textList !== undefined
        ? rangeList2LocList(textList.refRangeList, uri)
        : null;
}

export function getValDefInFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const { uri } = document;
    const { AST, ModuleVar } = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA === null) return getModuleVarDef(ModuleVar, position, wordUp, listAllUsing, uri);
    if (DA.nameRange.contains(position)) return null; // fnName === val

    const {
        paramMap,
        valMap,
        textMap,
    } = DA;
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

    const textList: TTextMetaOut | undefined = textMap.get(wordUp);
    return textList !== undefined
        ? rangeList2LocList(textList.refRangeList, uri)
        : null;
}
