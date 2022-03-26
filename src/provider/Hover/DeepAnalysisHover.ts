import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TArgAnalysis,
    TTextAnalysis,
    TValAnalysis,
} from '../../globalEnum';
import { EPrefix, setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';

export function DeepAnalysisHover(
    DA: DeepAnalysisResult,
    wordUp: string,
): vscode.MarkdownString | null {
    const {
        funcRawName,
        argMap,
        valMap,
        textMap,
    } = DA;

    const arg: TArgAnalysis | undefined = argMap.get(wordUp);
    if (arg) {
        const {
            isByRef,
            isVariadic,
            refRangeList,
            defRangeList,
        } = arg;
        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const value: TValAnalysis | undefined = valMap.get(wordUp);
    if (value) {
        const {
            refRangeList,
            defRangeList,
        } = value;
        // TODO const typeValType = getAhkTypeName(ahkValType);
        const prefix = EPrefix.var;
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const unKnownText: TTextAnalysis | undefined = textMap.get(wordUp);
    if (unKnownText) {
        const { refRangeList } = unKnownText;
        const prefix = EPrefix.unKnownText;
        return setMD(prefix, refRangeList, [], funcRawName, '');
    }

    return null;
}
