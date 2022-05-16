import * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { userDefFunc } from '../Def/DefProvider';

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    const { AhkSymbolList } = Detecter.getDocMap(document.uri.fsPath) ?? Detecter.updateDocDef(document);

    const DA: null | CAhkFunc = getDAWithPos(AhkSymbolList, position);
    if (DA === null || !DA.nameRange.contains(position) || DA.kind === vscode.SymbolKind.Method) {
        void vscode.window.showInformationMessage('please use rename at function def range');
        return null;
    }

    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, DA.upName, true);
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
