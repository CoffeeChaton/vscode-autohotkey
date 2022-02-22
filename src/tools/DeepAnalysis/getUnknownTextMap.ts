import * as vscode from 'vscode';
import { getGlobalValDef } from '../../core/getGlobalValDef';
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
    uri: vscode.Uri,
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
                    || (/^\d+$/ui).test(wordUp)
                    || argMap.has(wordUp)
                    || valMap.has(wordUp)
                    || getGlobalValDef(wordUp)
                ) {
                    ignoreSet.add(wordUp);
                    continue;
                }
            }

            const character = lStr.search(ahkValRegex(wordUp));

            if (character === -1) {
                console.error('🚀 ~ line', line);
                console.error('🚀 ~ ahkSymbol', ahkSymbol);
                console.error('🚀 ~ wordUp', wordUp);
                continue;
            }

            const range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + wordUp.length),
            );

            const loc = new vscode.Location(uri, range);
            const refLoc: vscode.Location[] = [...textMap.get(wordUp)?.refLoc ?? [], loc];

            const need: TTextAnalysis = {
                keyRawName,
                refLoc,
            };

            textMap.set(wordUp, need);
        }
    }

    return textMap;
}
