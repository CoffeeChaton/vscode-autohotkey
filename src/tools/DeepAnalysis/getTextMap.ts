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

export function getTextMap(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
    valMap: TValMap,
): TTextMap {
    const textMap: TTextMap = new Map<string, TTextAnalysis>();
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range

        // eslint-disable-next-line security/detect-unsafe-regex
        for (const v of lStr.matchAll(/(?<!\.)\b(\w+)\b/gu)) {
            const keyRawName = v[1];
            const wordUp = keyRawName.toLocaleUpperCase();
            if ((/^\d+$/ui).test(wordUp) || argMap.has(wordUp) || valMap.has(wordUp) || getGlobalValDef(wordUp)) {
                continue;
            }

            const character = lStr.search(ahkValRegex(wordUp));

            if (character === -1) {
                console.log('🚀 ~ line', line);
                console.log('🚀 ~ ahkSymbol', ahkSymbol);
                console.log('🚀 ~ wordUp', wordUp);
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
