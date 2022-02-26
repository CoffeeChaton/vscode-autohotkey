import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TC503,
    TTokenStream,
} from '../../../globalEnum';
import { ahkValRegex } from '../../regexTools';
import { newC503 } from './diag/c503';

export function getParamRef(
    argMap: TArgMap,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    uri: vscode.Uri,
): void {
    for (const [paramUpName, ArgAnalysis] of argMap) {
        const startLine = ahkSymbol.selectionRange.end.line;
        for (const { lStr, line } of DocStrMap) {
            if (line <= startLine) continue;
            const col = lStr.search(ahkValRegex(paramUpName));
            if (col === -1) continue;

            const range = new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + paramUpName.length),
            );

            const loc = new vscode.Location(uri, range);
            ArgAnalysis.refLoc.push(loc);

            const ParamNewName = lStr.substring(col, col + paramUpName.length);
            const c503Err: TC503 | null = newC503(ArgAnalysis, ParamNewName, range);
            if (c503Err) {
                console.log('🚀 ~ c503Err', c503Err);
                ArgAnalysis.c503List.push(c503Err);
            }
        }
    }
}
