import * as vscode from 'vscode';
import { CAhkFuncSymbol } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { userDefFunc } from '../Def/DefProvider';

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    const DA: undefined | CAhkFuncSymbol = getDAWithPos(document.uri.fsPath, position);
    if (DA === undefined || !DA.nameRange.contains(position)) {
        void vscode.window.showInformationMessage('please use rename at function def range');
        return null;
    }

    const wordUp: string = document.getText(DA.nameRange).toUpperCase();
    const listAllUsing = true;
    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
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
        if (!(/^\w+$/u).test(newName)) {
            void vscode.window.showInformationMessage('just support rename to "[A-Za-z0-9_]"');
            return null;
        }

        if ((/^\d/u).test(newName) || (/^_+$/u).test(newName)) {
            void vscode.window.showInformationMessage(`Please use normal newName, not support of "${newName}"`);
            return null;
        }

        return RenameProviderCore(document, position, newName);
    },
};

// fn_img_m() && "fn_img_m" && fn_img_m() && fn_img_m() && fn_img_m && fn_img_m && "fn_img_m"
//     O             O            O              O            X          X              O
