/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { DeepAnalysisResult } from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { getFnOfPos } from '../../tools/getScopeOfPos';

function DeepAnalysisRename(document: vscode.TextDocument, position: vscode.Position, word: string): vscode.Location[] {
    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const ed: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    const loc: vscode.Location[] = [];

    const argLoc = ed.argMap.get(word);
    if (argLoc) {
        loc.push(...argLoc.defLoc, ...argLoc.refLoc);
    }

    const locList = ed.valMap.get(word);

    if (locList) {
        console.log('🚀 ~ locList', locList); // bug
        // loc.push(...locList.defLoc, ...locList.refLoc);
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
        const wordRange = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w+\b(?!%)/);
        if (!wordRange) return null;
        const word = document.getText(wordRange);

        const edit = new vscode.WorkspaceEdit();
        const locList = DeepAnalysisRename(document, position, word.toUpperCase());
        for (const loc of locList) {
            edit.replace(loc.uri, loc.range, newName);
        }
        // const fnRenameList = fnRename()
        return edit;
    }
}
