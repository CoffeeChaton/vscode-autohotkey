import * as vscode from 'vscode';
import { TArgAnalysis, TC503 } from '../../../../globalEnum';

export function newC503(oldParam: TArgAnalysis, ParamNewName: string, range: vscode.Range): TC503 | null {
    // eslint-disable-next-line no-magic-numbers
    if (oldParam.keyRawName !== ParamNewName && oldParam.c503List.length < 5) {
        const newWarn: TC503 = {
            ParamNewName, // case sensitivity;
            range,
        };
        return newWarn;
    }
    return null;
}
