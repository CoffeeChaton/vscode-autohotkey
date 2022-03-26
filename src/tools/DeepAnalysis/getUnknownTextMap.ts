import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTextAnalysis,
    TTextMap,
    TTokenStream,
    TValMap,
} from '../../globalEnum';
import { ahkValRegex } from '../regexTools';

export function getUnknownTextMap(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
    valMap: TValMap,
): TTextMap {
    const ignoreSet = new Set<string>();
    const textMap: TTextMap = new Map<string, TTextAnalysis>();
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range

        // eslint-disable-next-line security/detect-unsafe-regex
        for (const v of lStr.matchAll(/(?<!\.)\b(\w+)\b(?!\()/gu)) {
            const keyRawName = v[1];
            const wordUp = keyRawName.toLocaleUpperCase();
            if (ignoreSet.has(wordUp)) continue;
            if (!textMap.has(wordUp)) {
                if (
                    (/^[A_\d]_/u).test(wordUp) // (A_Variables) or ( _*2 start varName EX: __varName) or (start with number EX: 0_VarName)
                    || (/^\d+$/ui).test(wordUp) // just number
                    || argMap.has(wordUp)
                    || valMap.has(wordUp)
                ) {
                    ignoreSet.add(wordUp);
                    continue;
                }
            }

            const character = lStr.search(ahkValRegex(wordUp)); // need fix

            if (character === -1) {
                void vscode.window.showErrorMessage(`getUnknownTextMap Error at line ${line} of ${ahkSymbol.name}()`);
                continue;
            }

            const range = new vscode.Range(
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
