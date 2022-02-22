import * as vscode from 'vscode';
import { diagColl } from '../../core/diagColl';
import {
    DeepAnalysisResult,
    TAhkSymbol,
    TTextMap,
    TTokenStream,
    TValMap,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import { setArgMap } from './fnArgs';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getValDef } from './getValDef';
import { setValMapRef } from './setValMapRef';

function setValMap(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, argMap: TArgMap): TValMap {
    const valMap: TValMap = getValDef(uri, ahkSymbol, DocStrMap, argMap);

    return setValMapRef(uri, ahkSymbol, DocStrMap, valMap, argMap);
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
    const textMap: TTextMap = getUnknownTextMap(uri, ahkSymbol, DocStrMap, argMap, valMap);
    const v: DeepAnalysisResult = {
        argMap,
        valMap,
        textMap,
    };

    diagColl.set(uri, [...diagS, ...diagArgs]);

    return w.setWm(ahkSymbol, v);
}
