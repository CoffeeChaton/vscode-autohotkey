import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';

export const RangeFormatProvider: vscode.DocumentRangeFormattingEditProvider = {
    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCore({
            document,
            options,
            fmtStart: range.start.line,
            fmtEnd: range.end.line,
            from: EFormatChannel.byFormatRange,
            needDiff: true,
        });
    },
};
