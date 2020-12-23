import * as vscode from 'vscode';
import { FormatCore } from '../Format/FormatProvider';

async function chIsNextLine(document: vscode.TextDocument, position: vscode.Position,
    ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken)
    : Promise<vscode.TextEdit[]> {
    const array = await FormatCore(document, options, token, false);
    return array ? [array[position.line - 1], array[position.line]] : [];
}
export class OnTypeFormattingEditProvider implements vscode.OnTypeFormattingEditProvider {
    public provideOnTypeFormattingEdits(document: vscode.TextDocument, position: vscode.Position,
        ch: string, options: vscode.FormattingOptions, token: vscode.CancellationToken)
        : vscode.ProviderResult<vscode.TextEdit[]> {
        if (ch === '\n') {
            return chIsNextLine(document, position, ch, options, token);
        }
        return [];
    }
}
