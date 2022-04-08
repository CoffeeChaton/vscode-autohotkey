import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { TDAMeta } from './TypeFnMeta';

export function getDAWithPos(document: vscode.TextDocument, position: vscode.Position): undefined | TDAMeta {
    const DAList: undefined | TDAMeta[] = Detecter.getDocMap(document.uri.fsPath)?.DAList;
    if (DAList === undefined) return undefined;

    return DAList.find((DA: TDAMeta): boolean => DA.range.contains(position)); // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
