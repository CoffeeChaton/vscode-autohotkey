import * as vscode from 'vscode';
import { TAhkSymbol, TTokenStream } from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { Pretreatment } from '../Pretreatment';
import { ClassWm } from '../wm';
import {
    TArgMap,
    TDeepAnalysisMeta,
    TTextMap,
    TValMap,
} from './FnMetaType';
import { getFnVarMain } from './FnVar/getFnVarMain';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamMain } from './Param/getParam';

// eslint-disable-next-line no-magic-numbers
const hr2 = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbol, TDeepAnalysisMeta>(hr2, 'DeepAnalysis', 0);

export function DeepAnalysis(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): null | TDeepAnalysisMeta {
    const kindStr: 'Function' | 'Method' | null = kindPick(ahkSymbol.kind);
    if (kindStr === null) return null;

    const cache: undefined | TDeepAnalysisMeta = wm.getWm(ahkSymbol);
    if (cache !== undefined) return cache;

    const DocStrMap: TTokenStream = Pretreatment(
        document.getText(ahkSymbol.range).split('\n'),
        ahkSymbol.range.start.line,
    );

    const argMap: TArgMap = getParamMain(ahkSymbol, DocStrMap);
    const valMap: TValMap = getFnVarMain(ahkSymbol, DocStrMap, argMap);
    const textMap: TTextMap = getUnknownTextMap(ahkSymbol, DocStrMap, argMap, valMap);
    const v: TDeepAnalysisMeta = {
        argMap,
        valMap,
        textMap,
        funcRawName: ahkSymbol.name,
    };

    return wm.setWm(ahkSymbol, v);
}
