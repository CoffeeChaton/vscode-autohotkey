/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { TDAMeta, TParamMeta, TValMeta } from '../../tools/DeepAnalysis/TypeFnMeta';

function DeepAnalysisRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Range[] {
    const DA: TDAMeta | null = getDAWithPos(document, position);
    if (!DA) return [];

    const paramMeta: TParamMeta | undefined = DA.paramMap.get(wordUp);
    if (paramMeta !== undefined) {
        return [...paramMeta.defRangeList, ...paramMeta.refRangeList];
    }

    const valMeta: TValMeta | undefined = DA.valMap.get(wordUp);
    if (valMeta !== undefined) {
        return [...valMeta.defRangeList, ...valMeta.refRangeList];
    }

    return [];
}

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    // eslint-disable-next-line security/detect-unsafe-regex
    const wordRange: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b(?!\()/u);
    if (wordRange === undefined) return null;
    const word: string = document.getText(wordRange);

    const rangeList: vscode.Range[] = DeepAnalysisRename(document, position, word.toUpperCase());

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const range of rangeList) {
        edit.replace(
            document.uri,
            range,
            newName,
            {
                needsConfirmation: true,
                label: 'test',
                description: 'test-description',
            },
        );
    }
    // const fnRenameList = fnRename()
    console.log('🚀 ~ edit', edit);
    return edit;
}

export class RenameProvider implements vscode.RenameProvider {
    public provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.WorkspaceEdit> {
        return RenameProviderCore(document, position, newName);
    }
}
