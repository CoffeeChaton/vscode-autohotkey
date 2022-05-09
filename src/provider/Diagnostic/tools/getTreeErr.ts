import * as vscode from 'vscode';
import { TAhkSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getLabelErr } from './TreeErr/getLabelErr';
import { getSwErr } from './TreeErr/getSwErr';

export function getTreeErr(children: readonly TAhkSymbol[], displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const ch of children) {
        digS.push(
            ...getSwErr(ch, displayErr),
            ...getLabelErr(ch, displayErr),
            ...getTreeErr(ch.children, displayErr),
        );
    }
    return digS;
}
