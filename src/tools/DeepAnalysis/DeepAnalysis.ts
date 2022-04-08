import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TAhkSymbolList,
    TGValMap,
    TTokenStream,
} from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { getDocStrMapMask } from '../getDocStrMapMask';
import { getFuncDocCore } from '../MD/getFuncDocMD';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamDef } from './Param/getParamDef';
import {
    TDAMeta,
    TParamMap,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

function getDACore(
    document: vscode.TextDocument,
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
): null | TDAMeta {
    const kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function | null = kindPick(AhkSymbol.kind);
    if (kind === null) return null;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol, DocStrMap);

    const paramMap: TParamMap = getParamDef(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarDef(AhkSymbol, AhkTokenList, paramMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, paramMap, valMap, GValMap);
    const funcRawName: string = AhkSymbol.name;

    const md: vscode.MarkdownString = getFuncDocCore(AhkSymbol, document, AhkTokenList); // TODO emmt
    const v: TDAMeta = {
        kind,
        paramMap,
        valMap,
        textMap,
        funcRawName,
        upName: funcRawName.toUpperCase(),
        selectionRangeText: document.getText(AhkSymbol.selectionRange),
        range: AhkSymbol.range,
        md,
    };

    return v;
}

export function DeepAnalysis(
    document: vscode.TextDocument,
    AhkSymbolList: TAhkSymbolList,
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
): TDAMeta[] {
    const funcMetaList: TDAMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind === vscode.SymbolKind.Class) {
            funcMetaList.push(...DeepAnalysis(document, AhkSymbol.children, DocStrMap, GValMap));
            continue;
        }
        const DA: TDAMeta | null = getDACore(document, AhkSymbol, DocStrMap, GValMap);
        if (DA !== null) funcMetaList.push(DA);
    }

    return funcMetaList;
}
