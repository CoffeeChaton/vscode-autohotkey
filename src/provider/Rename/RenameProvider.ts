import * as vscode from 'vscode';

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    // eslint-disable-next-line security/detect-unsafe-regex
    const wordRange: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`%#])\b\w+\b(?!\()/u);
    if (wordRange === undefined) return null;

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    // for (const range of rangeList) {
    //     edit.replace(
    //         document.uri,
    //         range,
    //         newName,
    //         {
    //             needsConfirmation: true,
    //             label: 'test',
    //             description: 'test-description',
    //         },
    //     );
    // }
    return null;
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
