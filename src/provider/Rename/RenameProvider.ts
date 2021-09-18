/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO RenameProvider
import * as vscode from 'vscode';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { DeepAnalysisResult } from '../../globalEnum';

function DeepAnalysisRename(document: vscode.TextDocument, position: vscode.Position, word: string)
    : vscode.Location[] {
    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const ed: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    const loc: vscode.Location[] = [];

    const argLoc = ed.argMap.get(word);
    if (argLoc) {
        console.log('🚀 ~ argLoc.defLoc', argLoc.defLoc);
        console.log('🚀 ~ argLoc.refLoc', argLoc.refLoc);
        loc.push(...argLoc.defLoc, ...argLoc.refLoc);
    }

    const locList = ed.valMap.get(word);

    if (locList) {
        console.log('🚀 ~ locList.defLoc', ...locList.defLoc);
        console.log('🚀 ~ locList.refLoc', ...locList.refLoc);
        loc.push(...locList.defLoc, ...locList.refLoc);
    }

    return loc;
}

export class RenameProvider implements vscode.RenameProvider {
    // public prepareRename(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken)
    //     : vscode.ProviderResult<vscode.Range | { placeholder: string, range: vscode.Range; }> {
    // }

    public provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken)
        : vscode.ProviderResult<vscode.WorkspaceEdit> {
        // eslint-disable-next-line security/detect-unsafe-regex
        const wordRange = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w\w*\b(?!%)/);
        if (!wordRange) return null;
        const word = document.getText(wordRange);

        const edit = new vscode.WorkspaceEdit();
        const locList = DeepAnalysisRename(document, position, word.toUpperCase());
        for (const loc of locList) {
            const { uri, range } = loc;
            // console.log('🚀 ~ RenameProvider ~ range', range);
            // const replaceRange = new vscode.Range();
            edit.replace(uri, range, newName);
        }
        return edit;
    }
}
