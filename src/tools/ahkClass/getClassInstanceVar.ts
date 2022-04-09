import * as vscode from 'vscode';
import { TFuncInput } from '../../core/getChildren';
import { TAhkSymbol } from '../../globalEnum';
import { removeParentheses } from '../str/removeParentheses';

export function getClassInstanceVar(FuncInput: TFuncInput): null | TAhkSymbol {
    const { line, lStr } = FuncInput;

    if (lStr.indexOf(':=') === -1) return null;
    if ((/^\s*\b(?:static|global)\b/iu).test(lStr)) return null;

    const name = removeParentheses(lStr)
        .split(',')
        .map((str) => str.replace(/:=.*/u, '').trim())
        .join(', ');

    const detail = 'Instance Var';
    const kind = vscode.SymbolKind.Property;
    const range = new vscode.Range(line, 0, line + 1, 0);

    return new vscode.DocumentSymbol(
        name,
        detail,
        kind,
        range,
        range,
    );
}
