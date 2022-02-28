import * as vscode from 'vscode';
import { DeepAnalysisResult, TArgAnalysis } from '../../globalEnum';
import { setMD } from '../../tools/setMD';
import { setPreFix } from '../../tools/setPreFix';
import { getAhkTypeName } from './getAhkTypeName';

/**
 * @param word  word.toUpperCase()
 */
export function DeepAnalysisHover(
    ed: DeepAnalysisResult,
    word: string,
): vscode.MarkdownString | null {
    const funcName = ed.funcRawName;

    const arg: TArgAnalysis | undefined = ed.argMap.get(word);
    if (arg) {
        const {
            isByRef,
            isVariadic,
            refLoc,
            defLoc,
        } = arg;
        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refLoc, defLoc, funcName, null);
    }

    const value = ed.valMap.get(word);
    if (value) {
        const {
            refLoc,
            defLoc,
            ahkValType,
        } = value;
        const typeValType = getAhkTypeName(ahkValType);
        const prefix = `${typeValType} var`;

        return setMD(prefix, refLoc, defLoc, funcName, null);
    }

    return null;
}
