import * as vscode from 'vscode';
import { diagColl } from '../../core/diag/diagRoot';
import {
    DeepAnalysisResult,
    TAhkSymbol,
    TTextMap,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import { getFnVarMain } from './FnVar/getFnVarMain';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamMain } from './Param/getParam';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<TAhkSymbol, DeepAnalysisResult>(10 * 60 * 1000, 'DeepAnalysis', 500000);

export function DeepAnalysis(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): null | DeepAnalysisResult {
    const kindStr: 'Function' | 'Method' | null = kindPick(ahkSymbol.kind);
    if (kindStr === null) return null;

    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const { uri } = document;
    const diagS = [...diagColl.get(uri) ?? []];
    const DocStrMap = Pretreatment(
        document.getText(ahkSymbol.range).split('\n'),
        ahkSymbol.range.start.line,
    );
    const { argMap, diagParam } = getParamMain(uri, ahkSymbol, DocStrMap);
    const { valMap, diagFnVar } = getFnVarMain(uri, ahkSymbol, DocStrMap, argMap);
    const textMap: TTextMap = getUnknownTextMap(uri, ahkSymbol, DocStrMap, argMap, valMap);
    const v: DeepAnalysisResult = {
        argMap,
        valMap,
        textMap,
    };

    diagColl.set(uri, [...diagS, ...diagParam, ...diagFnVar]);

    return w.setWm(ahkSymbol, v);
}
