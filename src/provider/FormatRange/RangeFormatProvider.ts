/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */

import * as vscode from 'vscode';
import { TFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';

export class RangeFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCore({
            document,
            options,
            fmtStart: range.start.line,
            fmtEnd: range.end.line,
            token,
            from: TFormatChannel.byFormatRange,
        });
    }
}
