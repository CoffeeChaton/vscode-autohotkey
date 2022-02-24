import * as vscode from 'vscode';
import { getCode503Default } from '../../../configUI';
import { EDiagCode } from '../../../diag';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { setDiagnostic } from '../../../provider/Diagnostic/setDiagnostic';
import { ahkValRegex } from '../../regexTools';

export function getParamRef(
    argMap: TArgMap,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    uri: vscode.Uri,
    diagParam: vscode.Diagnostic[],
): void {
    let warnNumber = getCode503Default();
    for (const [paramUpName, v] of argMap) {
        const startLine = ahkSymbol.selectionRange.end.line;
        for (const { lStr, line } of DocStrMap) {
            if (line <= startLine) continue;
            const col = lStr.search(ahkValRegex(paramUpName));
            if (col === -1) continue;

            const range = new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + paramUpName.length),
            );

            if (warnNumber > 0) {
                const newParamStr = lStr.substring(col, col + paramUpName.length);
                if (v.keyRawName !== newParamStr) {
                    const severity = vscode.DiagnosticSeverity.Warning;
                    diagParam.push(setDiagnostic(EDiagCode.code503, range, severity, []));
                    warnNumber -= 1;
                }
            }

            const loc = new vscode.Location(uri, range);
            v.refLoc.push(loc);
        }
    }
}
