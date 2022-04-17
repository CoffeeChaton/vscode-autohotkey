import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';
import { getDAList } from './getDAList';

export function getDAWithPos(
    document: vscode.TextDocument,
    position: vscode.Position,
): undefined | CAhkFuncSymbol {
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(document.uri.fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    const DAList: CAhkFuncSymbol[] = [];
    getDAList(AhkSymbolList, DAList);

    for (const DA of DAList) {
        if (DA.range.contains(position)) return DA;
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
