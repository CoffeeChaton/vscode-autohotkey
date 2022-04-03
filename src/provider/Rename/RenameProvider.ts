/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { TArgAnalysis, TDeepAnalysisMeta, TValAnalysis } from '../../tools/DeepAnalysis/TypeFnMeta';

function DeepAnalysisRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Range[] {
    const DA: TDeepAnalysisMeta | null = getDAWithPos(document, position);
    if (!DA) return [];

    const argMeta: TArgAnalysis | undefined = DA.argMap.get(wordUp);
    if (argMeta !== undefined) {
        return [...argMeta.defRangeList, ...argMeta.refRangeList];
    }

    const valMeta: TValAnalysis | undefined = DA.valMap.get(wordUp);
    if (valMeta !== undefined) {
        return [...valMeta.defRangeList, ...valMeta.refRangeList];
    }

    return [];
}

export class RenameProvider implements vscode.RenameProvider {
    public provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.WorkspaceEdit> {
        // eslint-disable-next-line security/detect-unsafe-regex
        const wordRange: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (wordRange !== undefined) return null;
        const word: string = document.getText(wordRange);

        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        const rangeList: vscode.Range[] = DeepAnalysisRename(document, position, word.toUpperCase());
        for (const range of rangeList) {
            edit.replace(document.uri, range, newName);
        }
        // const fnRenameList = fnRename()
        return edit;
    }
}
