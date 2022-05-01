import * as vscode from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { TAhkSymbolList } from '../../TAhkSymbolIn';

export function getFuncWithPos(
    fsPath: string,
    position: vscode.Position,
): undefined | CAhkFunc {
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return undefined;

    for (const DA of AhkSymbolList) {
        if (
            DA instanceof CAhkFunc
            && DA.range.contains(position)
        ) {
            return DA;
        }
    }
    return undefined;
    // at 8K line Gdip_all_2020_08_24 just need 1 ms
}
