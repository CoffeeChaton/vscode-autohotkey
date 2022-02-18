import * as vscode from 'vscode';
import { TFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';

async function chIsNextLine(
    document: vscode.TextDocument,
    position: vscode.Position,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
): Promise<vscode.TextEdit[]> {
    const array = await FormatCore({
        document,
        options,
        token,
        fmtStart: 0,
        fmtEnd: position.line - 1,
        from: TFormatChannel.byFormatOnType,
    });
    if (!array) return [];

    return [array[position.line - 1]];
}
export class OnTypeFormattingEditProvider implements vscode.OnTypeFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideOnTypeFormattingEdits(
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
    }
}
