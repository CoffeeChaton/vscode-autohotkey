import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { TDAMeta } from './TypeFnMeta';

export function getDAWithPos(document: vscode.TextDocument, position: vscode.Position): null | TDAMeta {
    const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(document.uri.fsPath);
    if (AhkFileData === undefined) return null;
    const { DAList } = AhkFileData;

    for (const DA of DAList) {
        if (DA.range.contains(position)) {
            return DA;
        }
    }
    return null;
}
