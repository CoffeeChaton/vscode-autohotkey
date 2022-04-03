import * as vscode from 'vscode';
import {
    TArgAnalysis,
    TDeepAnalysisMeta,
    TTextAnalysis,
    TValAnalysis,
} from '../../tools/DeepAnalysis/FnMetaType';
import { EPrefix, setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';

export function DeepAnalysisHover(
    DA: TDeepAnalysisMeta,
    wordUp: string,
): vscode.MarkdownString | null {
    const {
        funcRawName,
        argMap,
        valMap,
        textMap,
    } = DA;

    const argMeta: TArgAnalysis | undefined = argMap.get(wordUp);
    if (argMeta !== undefined) {
        const {
            isByRef,
            isVariadic,
            refRangeList,
            defRangeList,
        } = argMeta;
        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const value: TValAnalysis | undefined = valMap.get(wordUp);
    if (value !== undefined) {
        const {
            refRangeList,
            defRangeList,
        } = value;
        // TODO const typeValType = getAhkTypeName(ahkValType);
        const prefix = EPrefix.var;
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const unKnownText: TTextAnalysis | undefined = textMap.get(wordUp);
    if (unKnownText !== undefined) {
        const { refRangeList } = unKnownText;
        const prefix = EPrefix.unKnownText;
        return setMD(prefix, refRangeList, [], funcRawName, '');
    }

    return null;
}
