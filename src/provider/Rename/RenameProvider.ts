/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { DeepAnalysisResult, TArgAnalysis, TValAnalysis } from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { getFnOfPos } from '../../tools/getScopeOfPos';

function DeepAnalysisRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Range[] {
    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const ed: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    const loc: vscode.Range[] = [];

    const argMap: TArgAnalysis | undefined = ed.argMap.get(wordUp);
    if (argMap) {
        loc.push(...argMap.defRangeList, ...argMap.refRangeList);
    }

    const valMap: TValAnalysis | undefined = ed.valMap.get(wordUp);
    if (valMap) {
        loc.push(...valMap.defRangeList, ...valMap.refRangeList);
    }

    return loc;
}

export class RenameProvider implements vscode.RenameProvider {
    public provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.WorkspaceEdit> {
        // eslint-disable-next-line security/detect-unsafe-regex
        const wordRange = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (!wordRange) return null;
        const word = document.getText(wordRange);

        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        const rangeList: vscode.Range[] = DeepAnalysisRename(document, position, word.toUpperCase());
        for (const range of rangeList) {
            edit.replace(document.uri, range, newName, {
                needsConfirmation: true,
                label: 'is test now',
            });
        }
        // const fnRenameList = fnRename()
        return edit;
    }
}
