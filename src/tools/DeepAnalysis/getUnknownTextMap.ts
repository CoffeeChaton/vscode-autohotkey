/* eslint-disable max-statements */
import * as vscode from 'vscode';
import type {
    TParamMapIn,
    TParamMetaIn,
    TTextMapIn,
    TTextMetaIn,
    TValMapIn,
    TValMetaIn,
} from '../../AhkSymbol/CAhkFunc';
import type { TGlobalVal, TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { newC502 } from './FnVar/def/diag/c502';

function pushRef(
    oldDef: TParamMetaIn | TValMetaIn,
    keyRawName: string,
    startPos: vscode.Position,
    range: vscode.Range,
): void {
    if (oldDef.defRangeList.some((defRange: vscode.Range): boolean => defRange.contains(startPos))) {
        return;
    }

    oldDef.refRangeList.push(range);
    oldDef.c502Array.push(newC502(oldDef.keyRawName, keyRawName));
}

function getIgnoreList(): string[] {
    return [
        // DeepAnalysisAllFiles -> Word frequency statistics
        'IF',
        'ELSE',
        'RETURN',

        'STATIC',
        'LOCAL',
        'GLOBAL',

        'SETBATCHLINES',
        'SETTIMER',
        'SLEEP',

        'LISTVARS', // 'ListVars'.toUpperCase()
        'SEND',

        'SWITCH',
        'CASE',
        'DEFAULT',

        'TRUE',
        'FALSE',

        'FOR',
        'IN',
        'LOOP',
        'WHILE',
        'UNTIL',
        'BREAK',
        'CONTINUE',
        'BETWEEN',

        'MOUSEMOVE',
        'CLICK',
        'THIS',

        'IN',
        'NOT',
        'AND',
        'OR',

        'TRY',
        'THROW',
        'CATCH',
        'FINALLY',

        'GOSUB',
        'GOTO',

        'CRITICAL',
        'SUSPEND',
        'THREAD',
        'PAUSE',
        'RELOAD',
        // 'CLASS',
        'NEW',

        'MSGBOX',
    ];
}

// eslint-disable-next-line max-statements
// eslint-disable-next-line max-params
export function getUnknownTextMap(
    startLine: number,
    endLine: number,
    DocStrMap: TTokenStream,
    paramMap: TParamMapIn,
    valMap: TValMapIn,
    GValMap: TGValMap,
    name: string,
): TTextMapIn {
    const ignoreList: string[] = getIgnoreList();
    const textMap: TTextMapIn = new Map<string, TTextMetaIn>();
    for (const { lStr, line, fistWordUp } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;
        for (const v of lStr.matchAll(/(?<![.#])\b(\w+)\b(?!\()/gu)) {
            const keyRawName: string = v[1];
            const wordUp: string = keyRawName.toUpperCase();
            if (ignoreList.includes(wordUp)) continue;
            if (!textMap.has(wordUp)) {
                if (fistWordUp === wordUp) continue;
                if (
                    (/^[A_\d]_/u).test(wordUp) // (A_Variables) or "str" or ( _*2 start varName EX: __varName) or (start with number EX: 0_VarName)
                    || (/^\d+$/u).test(wordUp) // just number
                    || (/^0X[\dA-F]+$/u).test(wordUp) // NumHexConst = 0 x [0-9a-fA-F]+
                    /*
                     * let decLiteral: number = 6;
                     * let hexLiteral: number = 0xf00d;
                     * let binaryLiteral: number = 0b1010;
                     * let octalLiteral: number = 0o744;
                     */
                ) {
                    ignoreList.push(wordUp);
                    continue;
                }
            }

            const character: number | undefined = v.index;
            const { input } = v;

            if (character === undefined || input === undefined) {
                void vscode.window.showErrorMessage(`getUnknown Error at line ${line} of ${name}()`);
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

            const GValMapOldVal: TGlobalVal | undefined = GValMap.get(wordUp);
            if (GValMapOldVal !== undefined) {
                if (
                    !GValMapOldVal.defRangeList.some((r: vscode.Range): boolean => r.contains(range))
                    && !GValMapOldVal.refRangeList.some((r: vscode.Range): boolean => r.contains(range))
                ) {
                    GValMapOldVal.refRangeList.push(range);
                }
                continue;
            } // keep before valMap && paramMap

            const oldVal: TValMetaIn | undefined = valMap.get(wordUp);
            if (oldVal !== undefined) {
                pushRef(oldVal, keyRawName, startPos, range);
                continue;
            }

            const oldParam: TParamMetaIn | undefined = paramMap.get(wordUp);
            if (oldParam !== undefined) {
                pushRef(oldParam, keyRawName, startPos, range);
                continue;
            }

            //
            const need: TTextMetaIn = {
                keyRawName,
                refRangeList: [...textMap.get(wordUp)?.refRangeList ?? [], range],
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
