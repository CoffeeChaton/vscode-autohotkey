import * as vscode from 'vscode';
import { diagColl } from '../../core/diagColl';
import { getGlobalValDef } from '../../core/getGlobalValDef';
import {
    DeepAnalysisResult,
    EFnMode,
    EValType,
    TAhkSymbol,
    TAhkValType,
    TArgMap,
    TRunValType2,
    TTextMap,
    TTokenStream,
    TValAnalysis,
    TValMap,
} from '../../globalEnum';
import { fnModeToValType } from '../Func/fnModeToValType';
import { getFnModeWM } from '../Func/getFnMode';
import { kindPick } from '../Func/kindPick';
import { getCommentOfLine } from '../getCommentOfLine';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import { setArgMap } from './fnArgs';
import { getTextMap } from './getTextMap';
import { setValMapRef } from './setValMapRef';

export function getLineType(lStr: string, fnMode: EFnMode): EValType.local | EValType.global | EValType.Static {
    const fnTypeList: ([RegExp, TRunValType2])[] = [
        [/^\s*local\s/iu, EValType.local],
        [/^\s*global\s/iu, EValType.global],
        [/^\s*Static\s/iu, EValType.Static],
    ];
    for (const [ruler, t] of fnTypeList) {
        if (ruler.test(lStr)) {
            return t;
        }
    }
    return fnModeToValType(fnMode);
}

type TGetValue = {
    keyRawName: string;
    line: number;
    character: number;
    valMap: TValMap;
    textRaw: string;
    lStr: string;
    lineType: TAhkValType;
    uri: vscode.Uri;
    argList: TArgMap;
};

function getValue({
    keyRawName,
    line,
    character,
    valMap,
    textRaw,
    lStr,
    lineType,
    uri,
}: TGetValue): TValAnalysis {
    const range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + keyRawName.length),
    );
    const defLoc = new vscode.Location(uri, range);
    const comment = getCommentOfLine({ textRaw, lStr }) ?? '';
    // const arg = argList.get(keyRawName.toUpperCase());
    // if (arg) {
    //     return {
    //         keyRawName,
    //         defLoc: [defLoc, ...arg.defLoc],
    //         commentList: [comment, ...arg.commentList],
    //         refLoc: [],
    //         ahkValType: arg.ahkValType,
    //     };
    // } // FIXME

    const oldVal: TValAnalysis | undefined = valMap.get(keyRawName.toUpperCase());
    if (oldVal) {
        return {
            keyRawName,
            defLoc: [defLoc, ...oldVal.defLoc],
            commentList: [comment, ...oldVal.commentList],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
        };
    }

    const ahkValType = getGlobalValDef(keyRawName.toUpperCase())
        ? EValType.global
        : lineType;
    return {
        keyRawName,
        defLoc: [defLoc],
        commentList: [comment],
        refLoc: [],
        ahkValType,
    };
}

function setValMapDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, argList: TArgMap): TValMap {
    const fnMode = getFnModeWM(ahkSymbol, DocStrMap);
    const valMap: TValMap = new Map<string, TValAnalysis>();

    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, textRaw, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 2) continue; // a=b need length >=3

        const lineType: TAhkValType = getLineType(lStr, fnMode);
        // eslint-disable-next-line security/detect-unsafe-regex
        for (const v of lStr.matchAll(/(?<![.`])\b(\w+)\b\s*:?=/gu)) {
            const character = v.index;
            if (character === undefined) continue;
            const keyRawName = v[1];
            const value: TValAnalysis = getValue({
                keyRawName,
                line,
                character,
                valMap,
                textRaw,
                lStr,
                lineType,
                uri,
                argList,
            });
            valMap.set(keyRawName.toUpperCase(), value);
        }
    }

    return valMap;
}

function setValMap(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, argList: TArgMap): TValMap {
    const valMap: TValMap = setValMapDef(uri, ahkSymbol, DocStrMap, argList);

    return setValMapRef(uri, ahkSymbol, DocStrMap, valMap);
}

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<TAhkSymbol, DeepAnalysisResult>(10 * 60 * 1000, 'DeepAnalysis', 500000);

export function DeepAnalysis(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): null | DeepAnalysisResult {
    const kindStr = kindPick(ahkSymbol.kind);
    if (!kindStr) return null;

    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const { uri } = document;
    const diagS = [...diagColl.get(uri) ?? []];
    const DocStrMap = Pretreatment(
        document.getText(ahkSymbol.range).split('\n'),
        ahkSymbol.range.start.line,
    );
    const [argMap, diagArgs] = setArgMap(uri, ahkSymbol, DocStrMap);

    const valMap: TValMap = setValMap(uri, ahkSymbol, DocStrMap, argMap);
    const textMap: TTextMap = getTextMap(uri, ahkSymbol, DocStrMap, argMap, valMap);
    const v: DeepAnalysisResult = {
        argMap,
        valMap,
        textMap,
    };

    diagColl.set(uri, [...diagS, ...diagArgs]);

    return w.setWm(ahkSymbol, v);
}
