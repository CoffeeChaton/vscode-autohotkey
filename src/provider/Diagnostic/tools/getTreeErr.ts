import * as vscode from 'vscode';
import { TAhkSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getDirectivesErr } from './TreeErr/getDirectivesErr';
import { getLabelErr } from './TreeErr/getLabelErr';
import { getSwErr } from './TreeErr/getSwErr';

export function getTreeErr(children: readonly TAhkSymbol[], displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const ch of children) {
        if (displayErr[ch.range.start.line]) {
            digS.push(
                ...getSwErr(ch),
                ...getLabelErr(ch),
                ...getDirectivesErr(ch),
            );
        }
        digS.push(
            ...getTreeErr(ch.children, displayErr),
        );
    }
    return digS;
}
