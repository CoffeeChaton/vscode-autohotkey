import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import {
    TAhkSymbol,
    TTokenStream,
    TValAnalysis,
    TValMap,
} from '../../../globalEnum';
import { setDiagnostic } from '../../../provider/Diagnostic/setDiagnostic';

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
    diagVal: vscode.Diagnostic[];
};

function getValRef(
    {
        valMap,
        valMap2,
        o,
        valName,
        uri,
        line,
        diagVal,
    }: TNeed,
): TValAnalysis | null {
    // o === ['bgColor', 'bgColor', index: 18, input: '        Case ___: bgColor := 0xFF0000
    // ', groups: undefined]
    const defVal = valMap.get(valName.toUpperCase());
    if (!defVal) {
        console.error('🚀 ~ERR15~ name ~ valName : ', valName);
        return null;
    }
    const character = o.index;

    if (character === undefined) return null;

    const {
        keyRawName,
        defLoc,
        ahkValType,
    } = defVal;

    let code502Warn = 0;
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

        // eslint-disable-next-line no-magic-numbers
        const oldCode502Warn: number = useVal?.code502Warn ?? 3;
        if (oldCode502Warn > 0 && keyRawName !== o[1]) {
            // console.log('🚀 ~ o', o);
            const severity = vscode.DiagnosticSeverity.Warning;
            const tags = [vscode.DiagnosticTag.Unnecessary];
            const diag = setDiagnostic(EDiagCode.code502, newRefLoc.range, severity, tags);
            diagVal.push(diag);
            code502Warn = oldCode502Warn - 1;
        }

        return [...oldRefLocS, newRefLoc];
    })();

    return {
        keyRawName,
        defLoc,
        refLoc,
        ahkValType,
        code502Warn,
    };
}

// eslint-disable-next-line max-params
export function getFnVarRef(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    valMap: TValMap,
    diagVal: vscode.Diagnostic[],
): TValMap {
    const regMap: Map<string, RegExp> = getValRegMap(valMap);

    const valMap2: TValMap = new Map<string, TValAnalysis>();
    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        if (lStr.trim() === '') continue;

        regMap.forEach((reg, valName) => {
            const matches = lStr.matchAll(reg);
            for (const o of matches) {
                const newVal: TValAnalysis | null = getValRef({
                    valMap,
                    valMap2,
                    o,
                    valName: valName.toUpperCase(),
                    uri,
                    line,
                    diagVal,
                });
                if (newVal) {
                    valMap2.set(valName.toUpperCase(), newVal);
                }
            }
        });
    }

    return valMap2;
}

/**
 * FIXME
 *  cat := "neko"
 *  for i in range
 * ...
 * ......
 *  MsgBox , i am cat
 * Text is not var `i`
 */
