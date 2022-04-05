import * as vscode from 'vscode';
import { TAhkSymbol, TGValMap } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import { TFuncInput } from '../getChildren';
import { setGlobalVar } from './setGlobalVar';

function getSelectionRange(lStr: string, line: number, name: string): vscode.Range {
    const col = lStr.indexOf(name);
    return new vscode.Range(
        line,
        col,
        line,
        lStr.length,
    );
}

export function ahkGlobalDef(FuncInput: TFuncInput, gValMapBySelf: TGValMap): null | TAhkSymbol {
    const {
        DocStrMap,
        line,
        lStr,
    } = FuncInput;

    const strTrim = lStr.trim();
    if (strTrim === '') return null;

    if (!(/^global\b[\s,]/iu).test(strTrim)) return null;

    if ((/^global[\s,]+$/iu).test(strTrim)) return null;

    const range = getRangeOfLine(DocStrMap, line);

    const name = setGlobalVar(FuncInput, gValMapBySelf);
    return new vscode.DocumentSymbol(
        name,
        'global',
        vscode.SymbolKind.Variable,
        range,
        getSelectionRange(lStr, line, name),
    );
}
// just ref; global GLOBAL_VAL
// def; global GLOBAL_VAL := 0
// ref && user; -> GLOBAL_VAL := 0
