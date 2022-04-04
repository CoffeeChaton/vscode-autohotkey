import * as vscode from 'vscode';
import {
    TArgAnalysis,
    TDeepAnalysisMeta,
    TTextAnalysis,
    TValAnalysis,
} from '../../tools/DeepAnalysis/TypeFnMeta';
import { EPrefix, setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';

function PosInRange(arr: vscode.Range[], position: vscode.Position): boolean {
    return arr.some((range: vscode.Range): boolean => range.contains(position));
}

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

        if (!PosInRange([...refRangeList, ...defRangeList], position)) return null;

        const prefix = setPreFix(isByRef, isVariadic);
        return setMD(prefix, refRangeList, defRangeList, funcRawName, '');
    }

    const value: TValAnalysis | undefined = valMap.get(wordUp);
    if (value !== undefined) {
        const {
            refRangeList,
            defRangeList,
        } = value;
        if (!PosInRange([...refRangeList, ...defRangeList], position)) return null;

        // TODO const typeValType = getAhkTypeName(ahkValType);
        return setMD(EPrefix.var, refRangeList, defRangeList, funcRawName, '');
    }

    const unKnownText: TTextAnalysis | undefined = textMap.get(wordUp);
    if (unKnownText !== undefined) {
        const { refRangeList } = unKnownText;
        if (!PosInRange(refRangeList, position)) return null;

        return setMD(EPrefix.unKnownText, refRangeList, [], funcRawName, '');
    }

    return null;
}
