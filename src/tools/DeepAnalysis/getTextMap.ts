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

        for (const v of lStr.matchAll(/\b(\w+)\b/gu)) {
            const keyRawName = v[1].trim();
            const wordUp = keyRawName.toLocaleUpperCase();
            if ((/^\d+$/ui).test(wordUp) || argMap.has(wordUp) || valMap.has(wordUp)) continue;

            const character = lStr.search(ahkValRegex(wordUp));
            if (character === -1) continue;

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
