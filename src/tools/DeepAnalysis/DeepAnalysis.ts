import * as vscode from 'vscode';
import { diagColl } from '../../core/diagColl';
import {
    DeepAnalysisResult,
    TAhkSymbol,
    TTextMap,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import { setArgMap } from './fnArgs';
import { getUnknownTextMap } from './getUnknownTextMap';
import { setValMap } from './setValMap';

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
    const { argMap, diagParam } = setArgMap(uri, ahkSymbol, DocStrMap);
    const { valMap, diagVal } = setValMap(uri, ahkSymbol, DocStrMap, argMap);
    const textMap: TTextMap = getUnknownTextMap(uri, ahkSymbol, DocStrMap, argMap, valMap);
    const v: DeepAnalysisResult = {
        argMap,
        valMap,
        textMap,
    };

    diagColl.set(uri, [...diagS, ...diagParam, ...diagVal]);

    return w.setWm(ahkSymbol, v);
}
