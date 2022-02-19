import * as vscode from 'vscode';

export const getWorkspaceFolders = (): readonly vscode.WorkspaceFolder[] | null => {
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath === undefined) {
        vscode.window.showInformationMessage(
            'pleas using workspaces! \nhttps://code.visualstudio.com/docs/editor/workspaces',
        );
        return null;
    }
    return ahkRootPath;
};
