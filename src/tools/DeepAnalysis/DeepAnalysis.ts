import * as path from 'path';
import * as vscode from 'vscode';
import {
    EMode,
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
    GValMap: TGValMap, // eval!!
): null | TDAMeta {
    const kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function | null = kindPick(AhkSymbol.kind);
    if (kind === null) return null;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol, DocStrMap);

    const paramMap: TParamMap = getParamDef(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarDef(AhkSymbol, AhkTokenList, paramMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, paramMap, valMap, GValMap); // eval!!
    const funcRawName: string = AhkSymbol.name;

    const selectionRangeText: string = document.getText(AhkSymbol.selectionRange);
    const fileName: string = path.basename(document.uri.fsPath);
    const kindStr: string = kind === vscode.SymbolKind.Function
        ? EMode.ahkFunc
        : EMode.ahkMethod;
    const md: vscode.MarkdownString = getFuncDocCore(kindStr, fileName, AhkTokenList, selectionRangeText); // TODO emmt

    const v: TDAMeta = {
        kind,
        paramMap,
        valMap,
        textMap,
        funcRawName,
        upName: funcRawName.toUpperCase(),
        selectionRangeText,
        range: AhkSymbol.range,
        md,
    };

    return v;
}

export function DeepAnalysis(
    document: vscode.TextDocument, // TODO remove this...
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
