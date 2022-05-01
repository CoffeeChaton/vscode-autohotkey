import * as vscode from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { TAhkSymbolList } from '../../TAhkSymbolIn';

export function getDAList(AhkSymbolList: TAhkSymbolList): CAhkFunc[] {
    const result: CAhkFunc[] = [];
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA.kind === vscode.SymbolKind.Class) {
            result.push(...getDAList(DA.children));
        }
    }
    return result;
}
