import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFnRefLike } from '../Def/getFnRef';
import { getFuncRef } from '../Def/getFnRef';

function RenameProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
): vscode.WorkspaceEdit | null {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const { AST } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA === null || !DA.nameRange.contains(position) || DA.kind === vscode.SymbolKind.Method) {
        void vscode.window.showInformationMessage('please use rename at function def name range');
        return null;
    }

    const userDefLink: readonly TFnRefLike[] = getFuncRef(DA);
    if (userDefLink.length === 0) return null;

    const fnNameLen: number = DA.name.length;
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const v of userDefLink) {
        const {
            uri,
            line,
            col,
        } = v;
        const range: vscode.Range = new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + fnNameLen),
        );
        edit.replace(
            uri,
            range,
            newName,
        );
    }
    // TODO rename,For safety, do not replace func("fnName") case, please use ctrl+f to replace the search
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
        // TODO check newName

        return RenameProviderCore(document, position, newName);
    },
};

/*
 * fn_img_m() && "fn_img_m" && fn_img_m() && fn_img_m() && fn_img_m && fn_img_m && "fn_img_m"
 *     O             O            O              O            X          X              O
 */
