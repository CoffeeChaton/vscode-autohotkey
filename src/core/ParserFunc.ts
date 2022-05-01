import * as path from 'path';
import * as vscode from 'vscode';
import {
    CAhkFunc,
    TParamMapIn,
    TTextMapIn,
    TValMapIn,
} from '../CAhkFunc';
import { EMode } from '../Enum/EMode';
import { TTokenStream } from '../globalEnum';
import { getFnVarDef } from '../tools/DeepAnalysis/FnVar/getFnVarDef';
import { getParamDef } from '../tools/DeepAnalysis/getParamDef';
import { getUnknownTextMap } from '../tools/DeepAnalysis/getUnknownTextMap';
import { getDocStrMapMask } from '../tools/getDocStrMapMask';
import { getFuncDocCore } from '../tools/MD/getFuncDocMD';
import { TFuncInput } from './getChildren';

function getFuncDetail(line: number, DocStrMap: TTokenStream): string {
    if (line === 0) return '';
    const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
    return PreviousLineText.startsWith(';@')
        ? PreviousLineText.substring(2) // 2=== ';@'.len
        : '';
}

type TGetFuncCore = {
    FuncInput: TFuncInput;
    name: string;
    selectionRange: vscode.Range;
    range: vscode.Range;
    children: vscode.DocumentSymbol[];
};
export function getFuncCore(
    {
        FuncInput,
        name,
        selectionRange,
        range,
        children,
    }: TGetFuncCore,
): CAhkFunc {
    const {
        inClass,
        line,
        DocStrMap,
        document,
        GValMap,
    } = FuncInput;

    const kind = inClass
        ? vscode.SymbolKind.Method
        : vscode.SymbolKind.Function;
    const detail: string = getFuncDetail(line, DocStrMap);

    const AhkTokenList: TTokenStream = getDocStrMapMask(range, DocStrMap);

    const paramMap: TParamMapIn = getParamDef(name, selectionRange, AhkTokenList);
    const startLine = selectionRange.end.line;
    const endLine = range.end.line;
    // normal mode OK!
    // if is global mode
    // if is local mode
    // if is static mode
    const valMap: TValMapIn = getFnVarDef(startLine, endLine, AhkTokenList, paramMap, GValMap);
    const textMap: TTextMapIn = getUnknownTextMap(startLine, endLine, AhkTokenList, paramMap, valMap, GValMap, name); // eval!!

    const selectionRangeText: string = document.getText(selectionRange);
    const fileName: string = path.basename(document.uri.fsPath);
    const kindStr: string = kind === vscode.SymbolKind.Function
        ? EMode.ahkFunc
        : EMode.ahkMethod;

    const myFn2: CAhkFunc = new CAhkFunc({
        name,
        detail,
        kind,
        range,
        selectionRange,
        selectionRangeText,
        md: getFuncDocCore(kindStr, fileName, AhkTokenList, selectionRangeText), // TODO emmt,
        uri: document.uri,
        defStack: [''], // TODO ---
        paramMap,
        valMap,
        textMap,
        children,
    });
    return myFn2;
}
