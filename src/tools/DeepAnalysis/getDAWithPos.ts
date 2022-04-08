import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { TDAMeta } from './TypeFnMeta';

export function getDAWithPos(document: vscode.TextDocument, position: vscode.Position): null | TDAMeta {
    const DAList: undefined | TDAMeta[] = Detecter.getDocMap(document.uri.fsPath)?.DAList;
    if (DAList === undefined) return null;

    // TODO: Interpolation search
    for (const DA of DAList) {
        if (DA.range.contains(position)) {
            return DA;
        }
    }
    return null;
}
