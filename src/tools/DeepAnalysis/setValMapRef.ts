import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TTokenStream,
    TValMap,
    TValObj,
} from '../../globalEnum';

function getValRegMap(valMap: TValMap): Map<string, RegExp> {
    const regMap: Map<string, RegExp> = new Map<string, RegExp>();

    for (const [valName] of valMap) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        regMap.set(valName, new RegExp(`(?<![.\`])\\b(${valName})\\b`, 'igu'));
    }
    return regMap;
}

type TNeed = {
    valMap: TValMap;
    valMap2: TValMap;
    o: RegExpMatchArray;
    valName: string;
    uri: vscode.Uri;
    line: number;
};

function setValUse(
    {
        valMap,
        valMap2,
        o,
        valName,
        uri,
        line,
    }: TNeed,
): TValObj | null {
    // o === ['bgColor', 'bgColor', index: 18, input: '        Case ___: bgColor := 0xFF0000
    // ', groups: undefined]
    const defVal = valMap.get(valName.toUpperCase());
    if (!defVal) {
        console.error('🚀 ~ERR15~ name ~ valName : ', valName);
        return null;
    }
    const character = o.index;
    if (character === undefined) {
        console.error('🚀 ~ERR24~ o.index : ', o);
        return null;
    }

    const {
        keyRawName,
        defLoc,
        commentList,
        ahkValType,
    } = defVal;

    const refLoc: vscode.Location[] = ((): vscode.Location[] => {
        const useVal = valMap2.get(valName.toUpperCase());
        const oldRefLocS: vscode.Location[] = useVal?.refLoc || [];
        const newRefLoc: vscode.Location = new vscode.Location(
            uri,
            new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + valName.length),
            ),
        );

        for (const { range } of defLoc) {
            if (newRefLoc.range.contains(range)) {
                return [...oldRefLocS];
            }
        }
        return [...oldRefLocS, newRefLoc];
    })();

    return {
        keyRawName,
        defLoc,
        commentList,
        refLoc,
        ahkValType,
    };
}

export function setValMapRef(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    valMap: TValMap,
): TValMap {
    const regMap = getValRegMap(valMap);

    const valMap2: TValMap = new Map<string, TValObj>();
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        if (lStr.trim() === '') continue;

        regMap.forEach((reg, valName) => {
            const matches = lStr.matchAll(reg);
            for (const o of matches) {
                const newVal: TValObj | null = setValUse({
                    valMap,
                    valMap2,
                    o,
                    valName: valName.toUpperCase(),
                    uri,
                    line,
                });
                if (newVal) {
                    valMap2.set(valName.toUpperCase(), newVal);
                }
            }
        });
    }

    return valMap2;
}
