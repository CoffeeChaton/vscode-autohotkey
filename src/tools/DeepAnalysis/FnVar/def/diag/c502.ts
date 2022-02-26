import * as vscode from 'vscode';
import { TC502, TValAnalysis } from '../../../../../globalEnum';

export function newC502(oldVal: TValAnalysis, RawName: string, defLoc: vscode.Location): TC502[] {
    // eslint-disable-next-line no-magic-numbers
    if (oldVal.keyRawName !== RawName && oldVal.c502List.length < 5) {
        const newWarn: TC502 = {
            varName: RawName, // case sensitivity;
            range: defLoc.range,
        };
        return [...oldVal.c502List, newWarn];
    }
    return [...oldVal.c502List];
}
