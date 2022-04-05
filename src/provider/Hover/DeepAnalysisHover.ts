import * as vscode from 'vscode';
import {
    TDAMeta,
    TParamMeta,
    TTextMeta,
    TValMeta,
} from '../../tools/DeepAnalysis/TypeFnMeta';
import { EPrefix, setMD } from '../../tools/MD/setMD';
import { setPreFix } from '../../tools/str/setPreFix';

function PosInRange(arr: vscode.Range[], position: vscode.Position): boolean {
    return arr.some((range: vscode.Range): boolean => range.contains(position));
}

export function DeepAnalysisHover(
    DA: TDAMeta,
    wordUp: string,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const {
        funcRawName,
        paramMap,
        valMap,
        textMap,
    } = DA;

    const argMeta: TParamMeta | undefined = paramMap.get(wordUp);
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

    const value: TValMeta | undefined = valMap.get(wordUp);
    if (value !== undefined) {
        const {
            refRangeList,
            defRangeList,
        } = value;
        if (!PosInRange([...refRangeList, ...defRangeList], position)) return null;

        // TODO const typeValType = getAhkTypeName(ahkValType);
        return setMD(EPrefix.var, refRangeList, defRangeList, funcRawName, '');
    }

    const textMeta: TTextMeta | undefined = textMap.get(wordUp);
    if (textMeta !== undefined) {
        const { refRangeList } = textMeta;
        if (!PosInRange(refRangeList, position)) return null;

        return setMD(EPrefix.unKnownText, refRangeList, [], funcRawName, '');
    }

    return null;
}
