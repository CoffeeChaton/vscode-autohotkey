import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TArgAnalysis,
    TTextAnalysis,
    TValAnalysis,
} from '../../globalEnum';
import { setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';
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
            refRangeList,
            defRangeList,
        } = arg;
        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refRangeList, defRangeList, funcName, '');
    }

    const value: TValAnalysis | undefined = ed.valMap.get(wordUp);
    if (value) {
        const {
            refRangeList,
            defRangeList,
            ahkValType,
        } = value;
        const typeValType = getAhkTypeName(ahkValType);
        const prefix = `${typeValType} var`;
        return setMD(prefix, refRangeList, defRangeList, funcName, '');
    }

    const unKnownText: TTextAnalysis | undefined = ed.textMap.get(wordUp);
    if (unKnownText) {
        const { refRangeList } = unKnownText;
        const prefix = 'unKnownText';
        return setMD(prefix, refRangeList, [], funcName, '');
    }

    return null;
}
