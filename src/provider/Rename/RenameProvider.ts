import * as vscode from 'vscode';
import { userDefTopSymbol } from '../Def/DefProvider';

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/ui);
    if (!range) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    const listAllUsing = true;
    const userDefLink: vscode.Location[] | null = userDefTopSymbol(document, position, wordUp, listAllUsing);
    if (userDefLink === null) return null;

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const Loc of userDefLink) {
        edit.replace(
            Loc.uri,
            Loc.range,
            newName,
            // {
            //     needsConfirmation: true,
            //     label: 'test',
            //     description: 'test-description',
            // },
        );
    }
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
