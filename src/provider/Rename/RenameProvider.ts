import * as vscode from 'vscode';
import { CAhkFuncSymbol, TParamMetaOut, TValMetaOut } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';

function DeepAnalysisRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Range[] {
    const DA: CAhkFuncSymbol | undefined = getDAWithPos(document, position);
    if (DA === undefined) return [];

    const paramMeta: TParamMetaOut | undefined = DA.paramMap.get(wordUp);
    if (paramMeta !== undefined) {
        return [...paramMeta.defRangeList, ...paramMeta.refRangeList];
    }

    const valMeta: TValMetaOut | undefined = DA.valMap.get(wordUp);
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

export const RenameProvider: vscode.RenameProvider = {
    provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.WorkspaceEdit> {
        return RenameProviderCore(document, position, newName);
    },
};
