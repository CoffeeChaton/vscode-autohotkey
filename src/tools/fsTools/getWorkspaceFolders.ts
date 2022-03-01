import * as vscode from 'vscode';

export function getWorkspaceFolders(): readonly vscode.WorkspaceFolder[] | null {
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath === undefined) {
        void vscode.window.showInformationMessage(
            'pleas using workspaces! \nhttps://code.visualstudio.com/docs/editor/workspaces',
        );
        return null;
    }
    return ahkRootPath;
}
