import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TAhkSymbol,
    TArgMap,
    TTextMap,
    TValMap,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import { getFnVarMain } from './FnVar/getFnVarMain';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamMain } from './Param/getParam';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, DeepAnalysisResult>(10 * 60 * 1000, 'DeepAnalysis', 500000);

export function DeepAnalysis(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): null | DeepAnalysisResult {
    const kindStr: 'Function' | 'Method' | null = kindPick(ahkSymbol.kind);
    if (kindStr === null) return null;

    const cache = wm.getWm(ahkSymbol);
    if (cache) return cache;

    const DocStrMap = Pretreatment(
        document.getText(ahkSymbol.range).split('\n'),
        ahkSymbol.range.start.line,
    );

    const argMap: TArgMap = getParamMain(ahkSymbol, DocStrMap);
    const valMap: TValMap = getFnVarMain(ahkSymbol, DocStrMap, argMap);
    const textMap: TTextMap = getUnknownTextMap(ahkSymbol, DocStrMap, argMap, valMap);
    const v: DeepAnalysisResult = {
        argMap,
        valMap,
        textMap,
        funcRawName: ahkSymbol.name,
    };

    return wm.setWm(ahkSymbol, v);
}
