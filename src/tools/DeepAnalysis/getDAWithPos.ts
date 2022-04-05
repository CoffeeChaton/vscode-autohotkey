import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { getFnMetaList } from './getFnMetaList';
import { TDAMeta } from './TypeFnMeta';

export function getDAWithPos(document: vscode.TextDocument, position: vscode.Position): null | TDAMeta {
    const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(document.uri.fsPath);
    if (AhkFileData === undefined) return null;
    const { AhkSymbolList, DocStrMap } = AhkFileData;

    const DAList: TDAMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
    for (const DA of DAList) {
        if (DA.range.contains(position)) {
            return DA;
        }
    }
    return null;
}
