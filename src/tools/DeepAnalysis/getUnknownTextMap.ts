import * as vscode from 'vscode';
import { TAhkSymbol, TTokenStream } from '../../globalEnum';
import {
    TArgMap,
    TTextAnalysis,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

export function getUnknownTextMap(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
    valMap: TValMap,
): TTextMap {
    const ignoreList: string[] = [
        // DeepAnalysisAllFiles ->Word frequency statistics
        'RETURN',
        'IF',
        'STATIC',
        'ELSE',
        'SLEEP',
        'CASE',
        'LOCAL',
        'LOOP',
        'GLOBAL',
        'ListVars'.toUpperCase(),
        'SEND',
        'SWITCH',
        'DEFAULT',
        'IN',
        'TRUE',
        'FALSE',
        'FOR',
        'BREAK',
        'CONTINUE',
        'MOUSEMOVE',
        'CLICK',
    ];
    const textMap: TTextMap = new Map<string, TTextAnalysis>();
    const startLine: number = ahkSymbol.selectionRange.end.line;
    const endLine: number = ahkSymbol.range.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;
        // eslint-disable-next-line security/detect-unsafe-regex
        for (const v of lStr.matchAll(/(?<![.%`])\b(\w+)\b(?!\()/gu)) {
            const keyRawName: string = v[1];
            const wordUp: string = keyRawName.toUpperCase();
            if (ignoreList.indexOf(wordUp) > -1) continue;
            if (!textMap.has(wordUp)) {
                if (
                    valMap.has(wordUp)
                    || argMap.has(wordUp)
                    || (/^[A_\d]_/u).test(wordUp) // (A_Variables) or ( _*2 start varName EX: __varName) or (start with number EX: 0_VarName)
                    || (/^\d+$/ui).test(wordUp) // just number
                    || (/^0x[\dA-F]+$/u).test(wordUp) // NumHexConst = 0 x [0-9a-fA-F]+
                ) {
                    ignoreList.push(wordUp);
                    continue;
                }
            }

            const character: number | undefined = v?.index;

            if (character === undefined) {
                void vscode.window.showErrorMessage(`getUnknownTextMap Error at line ${line} of ${ahkSymbol.name}()`);
                continue;
            }

            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + wordUp.length),
            );

            const need: TTextAnalysis = {
                keyRawName,
                refRangeList: [...textMap.get(wordUp)?.refRangeList ?? [], range],
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
