import * as vscode from 'vscode';
import {
    TArgAnalysis,
    TDeepAnalysisMeta,
    TTextAnalysis,
    TValAnalysis,
} from '../../tools/DeepAnalysis/TypeFnMeta';
import { EPrefix, setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';

export function DeepAnalysisHover(
    DA: TDeepAnalysisMeta,
    wordUp: string,
    position: vscode.Position,
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
        const isPosInRange: boolean = [...refRangeList, ...defRangeList]
            .some((range: vscode.Range): boolean => range.contains(position));
        if (!isPosInRange) return null;

        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const value: TValAnalysis | undefined = valMap.get(wordUp);
    if (value !== undefined) {
        const {
            refRangeList,
            defRangeList,
        } = value;
        const isPosInRange: boolean = [...refRangeList, ...defRangeList]
            .some((range: vscode.Range): boolean => range.contains(position));
        if (!isPosInRange) return null;

        // TODO const typeValType = getAhkTypeName(ahkValType);
        return setMD(EPrefix.var, refRangeList, defRangeList, funcRawName, '');
    }

    const unKnownText: TTextAnalysis | undefined = textMap.get(wordUp);
    if (unKnownText !== undefined) {
        const { refRangeList } = unKnownText;
        const isPosInRange: boolean = refRangeList.some((range: vscode.Range): boolean => range.contains(position));
        if (!isPosInRange) return null;

        return setMD(EPrefix.unKnownText, refRangeList, [], funcRawName, '');
    }

    return null;
}
