import * as vscode from 'vscode';
import { TAhkSymbol, TTokenStream } from '../../globalEnum';
import { newC502 } from './FnVar/def/diag/c502';
import {
    TParamMap,
    TParamMeta,
    TTextMap,
    TTextMeta,
    TValMap,
    TValMeta,
} from './TypeFnMeta';

function getIgnoreList(): string[] {
    return [
        // DeepAnalysisAllFiles -> Word frequency statistics
        'IF',
        'ELSE',
        'RETURN',
        'IN',
        'STATIC',
        'LOCAL',
        'GLOBAL',

        'SLEEP',

        'ListVars'.toUpperCase(),
        'SEND',

        'SWITCH',
        'CASE',
        'DEFAULT',

        'TRUE',
        'FALSE',

        'FOR',
        'LOOP',
        'BREAK',
        'CONTINUE',

        'MOUSEMOVE',
        'CLICK',
        'THIS',
        'AND',
        'OR',
    ];
}

// eslint-disable-next-line max-statements
export function getUnknownTextMap(
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    paramMap: TParamMap,
    valMap: TValMap,
): TTextMap {
    // 199 ms
    const ignoreList: string[] = getIgnoreList();
    const textMap: TTextMap = new Map<string, TTextMeta>();
    const startLine: number = AhkSymbol.selectionRange.end.line;
    const endLine: number = AhkSymbol.range.end.line;
    for (const { lStr, line, fistWordUp } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;
        // eslint-disable-next-line security/detect-unsafe-regex
        for (const v of lStr.matchAll(/(?<![.%`])\b(\w+)\b(?!\()/gu)) {
            const keyRawName: string = v[1];
            const wordUp: string = keyRawName.toUpperCase();
            if (ignoreList.indexOf(wordUp) > -1) continue;
            if (!textMap.has(wordUp)) {
                if (fistWordUp === wordUp) continue;
                if (
                    (/^[A_\d]_/u).test(wordUp) // (A_Variables) or "str" or ( _*2 start varName EX: __varName) or (start with number EX: 0_VarName)
                    || (/^\d+$/u).test(wordUp) // just number
                    || (/^0[xX][\dA-F]+$/u).test(wordUp) // NumHexConst = 0 x [0-9a-fA-F]+
                ) {
                    ignoreList.push(wordUp);
                    continue;
                }
            }

            const character: number | undefined = v?.index;
            const { input } = v;

            if (character === undefined || input === undefined) {
                void vscode.window.showErrorMessage(`getUnknownTextMap Error at line ${line} of ${AhkSymbol.name}()`);
                continue;
            }

            const L: string = input[character - 1];
            const R: string = input[character + keyRawName.length];
            if (L === '{' && R === '}') {
                // send {text} <-- text is not variable
                continue;
            }

            const startPos: vscode.Position = new vscode.Position(line, character);
            const range: vscode.Range = new vscode.Range(
                startPos,
                new vscode.Position(line, character + wordUp.length),
            );
            const oldVal: TValMeta | undefined = valMap.get(wordUp);
            if (oldVal) {
                if (oldVal.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
                    continue;
                }
                oldVal.refRangeList.push(range);
                oldVal.c502Array.push(newC502(oldVal.keyRawName, keyRawName));
                continue;
            }

            const oldParam: TParamMeta | undefined = paramMap.get(wordUp);
            if (oldParam) {
                if (oldParam.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
                    continue;
                }
                oldParam.refRangeList.push(range);
                oldParam.c502Array.push(newC502(oldParam.keyRawName, keyRawName));
                continue;
            }

            const need: TTextMeta = {
                keyRawName,
                refRangeList: [...textMap.get(wordUp)?.refRangeList ?? [], range],
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
