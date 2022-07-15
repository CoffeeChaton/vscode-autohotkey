import * as path from 'node:path';
import * as vscode from 'vscode';
import type {
    TParamMapIn,
    TTextMapIn,
    TValMapIn,
} from '../AhkSymbol/CAhkFunc';
import {
    CAhkFunc,
} from '../AhkSymbol/CAhkFunc';
import type { TTokenStream } from '../globalEnum';
import { getFnVarDef } from '../tools/DeepAnalysis/FnVar/getFnVarDef';
import { getParamDef } from '../tools/DeepAnalysis/getParamDef';
import { getUnknownTextMap } from '../tools/DeepAnalysis/getUnknownTextMap';
import type { TFuncDefData } from '../tools/Func/getFuncDef';
import { getFuncDef } from '../tools/Func/getFuncDef';
import { getDocStrMapMask } from '../tools/getDocStrMapMask';
import { getFuncDocCore } from '../tools/MD/getFuncDocMD';
import { getRange } from '../tools/range/getRange';
import type { TFuncInput } from './getChildren';
import { getChildren } from './getChildren';
import { ParserBlock } from './Parser';
import { ParserLine } from './ParserTools/ParserLine';

function getFuncDetail(line: number, DocStrMap: TTokenStream): string {
    if (line === 0) return '';
    const PreviousLineText = DocStrMap[line - 1].textRaw.trimStart();
    return PreviousLineText.startsWith(';@')
        ? PreviousLineText.slice(2) // 2=== ';@'.len
        : '';
}

// TODO spilt this func
// eslint-disable-next-line max-lines-per-function
export function getFunc(FuncInput: TFuncInput): CAhkFunc | null {
    const {
        DocStrMap,
        line,
        RangeEndLine,
        defStack,
        lStr,
        document,
        GValMap,
    } = FuncInput;

    const col: number = lStr.indexOf('(');
    if (lStr.length === 0 || col === -1 || lStr.includes('}')) return null;
    const isFunc: TFuncDefData | null = getFuncDef(DocStrMap, line);
    if (isFunc === null) return null;

    const { name, selectionRange } = isFunc;

    const range = getRange(DocStrMap, line, selectionRange.end.line, RangeEndLine);
    const ch = getChildren<CAhkFunc>(
        [ParserBlock.getSwitchBlock, ParserLine],
        {
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            defStack,
            document,
            GValMap,
        },
    );

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

    const myFn2: CAhkFunc = new CAhkFunc({
        name,
        detail: getFuncDetail(line, DocStrMap),
        range,
        selectionRange,
        selectionRangeText,
        md: getFuncDocCore(fileName, AhkTokenList, selectionRangeText, defStack),
        uri: document.uri,
        defStack,
        paramMap,
        valMap,
        textMap,
        ch,
        nameRange: new vscode.Range(
            selectionRange.start,
            new vscode.Position(
                line,
                col,
            ),
        ),
    });
    return myFn2;
}
