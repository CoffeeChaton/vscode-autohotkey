import * as vscode from 'vscode';
import { TAhkSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getSwErr } from './getSwErr';

export function getTreeErr(children: readonly TAhkSymbol[], displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const ch of children) {
        digS.push(
            ...getSwErr(ch, displayErr),
            ...getTreeErr(ch.children, displayErr),
        );
    }
    return digS;
}
