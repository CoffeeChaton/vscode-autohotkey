import * as vscode from 'vscode';
import { DeepAnalysisResult, TArgAnalysis } from '../../globalEnum';
import { setMD } from '../../tools/setMD';
import { setPreFix } from '../../tools/setPreFix';
import { getAhkTypeName } from './getAhkTypeName';

export function DeepAnalysisHover(
    ed: DeepAnalysisResult,
    wordUp: string,
): vscode.MarkdownString | null {
    const funcName = ed.funcRawName;

    const arg: TArgAnalysis | undefined = ed.argMap.get(wordUp);
    if (arg) {
        const {
            isByRef,
            isVariadic,
            refLocList,
            defLocList,
        } = arg;
        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refLocList, defLocList, funcName, null);
    }

    const value = ed.valMap.get(wordUp);
    if (value) {
        const {
            refLocList,
            defLocList,
            ahkValType,
        } = value;
        const typeValType = getAhkTypeName(ahkValType);
        const prefix = `${typeValType} var`;

        return setMD(prefix, refLocList, defLocList, funcName, null);
    }

    return null;
}
