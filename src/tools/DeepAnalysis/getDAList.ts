import * as vscode from 'vscode';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';

export function getDAList(AhkSymbolList: TAhkSymbolList, need: CAhkFuncSymbol[]): void {
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFuncSymbol) {
            need.push(DA);
        } else if (DA.kind === vscode.SymbolKind.Class) {
            getDAList(DA.children, need);
        }
    }
}
