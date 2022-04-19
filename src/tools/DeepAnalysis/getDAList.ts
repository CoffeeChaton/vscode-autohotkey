import * as vscode from 'vscode';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';

export function getDAList(AhkSymbolList: TAhkSymbolList): CAhkFuncSymbol[] {
    const result: CAhkFuncSymbol[] = [];
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFuncSymbol) {
            result.push(DA);
        } else if (DA.kind === vscode.SymbolKind.Class) {
            result.push(...getDAList(DA.children));
        }
    }
    return result;
}
