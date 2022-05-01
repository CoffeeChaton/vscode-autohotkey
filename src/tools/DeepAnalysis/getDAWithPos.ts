import * as vscode from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { TAhkSymbolList } from '../../TAhkSymbolIn';
import { getDAList } from './getDAList';

export function getDAWithPos(
    fsPath: string,
    position: vscode.Position,
): undefined | CAhkFunc {
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);

    for (const DA of DAList) {
        if (DA.range.contains(position)) return DA;
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
