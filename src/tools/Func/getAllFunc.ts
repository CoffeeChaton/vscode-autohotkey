import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { DeepReadonly } from '../../globalEnum';
import { TDAMeta } from '../DeepAnalysis/TypeFnMeta';

type TKeyUpName = string;
type TMap = Map<TKeyUpName, TDAMeta>;

export type TFullFuncMap = DeepReadonly<TMap>;

export function getAllFunc(): TFullFuncMap {
    const funcMap: TMap = new Map();

    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { DAList } = AhkFileData;
        for (const DA of DAList) {
            if (DA.kind === vscode.SymbolKind.Function) {
                funcMap.set(DA.upName, DA);
            }
        }
    }
    return funcMap;
}
