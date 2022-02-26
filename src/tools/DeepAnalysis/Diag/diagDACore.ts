import * as vscode from 'vscode';
import { DeepAnalysisResult } from '../../../globalEnum';
import { caseSensitivityParam, caseSensitivityVar } from './caseSensitivity';
import { paramNeverUsed } from './paramNeverUsed';

export type TDiagDA = {
    code501List: vscode.Diagnostic[];
    code502List: vscode.Diagnostic[];
    code503List: vscode.Diagnostic[];
};
export function diagDACore(DA: DeepAnalysisResult, DiagDA: TDiagDA): TDiagDA {
    const {
        code501List,
        code502List,
        code503List,
    } = DiagDA;
    const c501: vscode.Diagnostic[] = paramNeverUsed(DA.argMap);
    const c502: vscode.Diagnostic[] = caseSensitivityVar(DA.valMap, code502List); // var case sensitivity
    const c503: vscode.Diagnostic[] = caseSensitivityParam(DA.argMap, code503List);
    return {
        code501List: [...code501List, ...c501],
        code502List: [...c502],
        code503List: [...c503],
    };
}
