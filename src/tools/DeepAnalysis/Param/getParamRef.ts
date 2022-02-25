import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { ahkValRegex } from '../../regexTools';

export function getParamRef(
    argMap: TArgMap,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    uri: vscode.Uri,
): void {
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

            const loc = new vscode.Location(uri, range);
            v.refLoc.push(loc);
        }
    }
}
