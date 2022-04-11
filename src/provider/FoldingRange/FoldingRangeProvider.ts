import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { EDetail } from '../../globalEnum';

function FoldingRangeCore(document: vscode.TextDocument): vscode.FoldingRange[] {
    // 8k line just need 4ms, I think it's good.
    const { DocStrMap } = Detecter.updateDocDef(document);
    const result: vscode.FoldingRange[] = [];
    const lineList: [number, number][] = []; // [start, end]
    let s = 0;
    for (
        const {
            lStr,
            line,
            textRaw,
            detail,
        } of DocStrMap
    ) {
        if (detail.indexOf(EDetail.inComment) > -1) continue;
        if (textRaw.length < lStr.length) continue;
        if (detail.indexOf(EDetail.inLTrim1) > -1 || detail.indexOf(EDetail.inLTrim2) > -1) continue;
        if (textRaw.trimStart().startsWith(';')) {
            s = s === 0
                ? line
                : s;
        } else if (s !== 0) {
            lineList.push([s, line - 1]);
            s = 0;
        }
    }

    for (const [start, end] of lineList) {
        result.push(new vscode.FoldingRange(start, end, vscode.FoldingRangeKind.Comment));
    }
    // ahk #Include not used very much...
    // i don't think need to provide Folding....
    // result.push(new vscode.FoldingRange(0, 10, vscode.FoldingRangeKind.Imports));
    return result;
}

export const FoldingRangeProvider: vscode.FoldingRangeProvider = {
    provideFoldingRanges(
        document: vscode.TextDocument,
        _context: vscode.FoldingContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.FoldingRange[]> {
        return FoldingRangeCore(document);
    },
};
