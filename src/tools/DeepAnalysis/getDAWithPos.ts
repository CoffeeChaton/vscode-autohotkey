import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { getFnMetaList } from './getFnMetaList';
import { TDeepAnalysisMeta } from './TypeFnMeta';

export function getDAWithPos(document: vscode.TextDocument, position: vscode.Position): null | TDeepAnalysisMeta {
    const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(document.uri.fsPath);
    if (AhkFileData === undefined) return null;
    const { AhkSymbolList, DocStrMap } = AhkFileData;

    const DAList: TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
    for (const DA of DAList) {
        if (DA.range.contains(position)) {
            return DA;
        }
    }
    return null;
}
