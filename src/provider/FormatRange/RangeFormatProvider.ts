import * as vscode from 'vscode';
import { TFormatChannel } from '../../globalEnum';
import { FormatCore } from '../Format/FormatProvider';

export class RangeFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentRangeFormattingEdits(
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
            from: TFormatChannel.byFormatRange,
            needDiff: true,
        });
    }
}
