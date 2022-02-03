import * as vscode from 'vscode';
import { FuncInputType } from '../../core/getChildren';
import { TAhkSymbol } from '../../globalEnum';
import { removeParentheses } from '../removeParentheses';

export function getClassInstanceVar(FuncInput: FuncInputType): false | TAhkSymbol {
    const { line, lStr } = FuncInput;

    if (lStr.indexOf(':=') === -1) return false;
    if ((/^\s*\b(?:static|global)\b/i).test(lStr)) return false;

    const name = removeParentheses(lStr)
        .split(',')
        .map((str) => str.replace(/:=.*/, '').trim())
        .join(', ');

    const detail = 'Instance Var';
    const kind = vscode.SymbolKind.Variable;
    const range = new vscode.Range(line, 0, line + 1, 0);

    return new vscode.DocumentSymbol(
        name,
        detail,
        kind,
        range,
        range,
    );
}
