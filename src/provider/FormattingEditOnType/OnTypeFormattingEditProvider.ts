import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';

function chIsNextLine(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: vscode.FormattingOptions,
    _token: vscode.CancellationToken,
): vscode.TextEdit[] {
    const array: vscode.TextEdit[] = FormatCore({
        document,
        options,
        fmtStart: 0,
        fmtEnd: position.line - 1,
        from: EFormatChannel.byFormatOnType,
        needDiff: false,
    });

    return [array[position.line - 1]];
}

export const OnTypeFormattingEditProvider: vscode.OnTypeFormattingEditProvider = {
    provideOnTypeFormattingEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        ch: string,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        if (ch === '\n') {
            return chIsNextLine(document, position, options, token);
        }
        return [];
    },
};
