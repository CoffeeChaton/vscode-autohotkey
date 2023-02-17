import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { geRenameConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import type { TFnRefLike } from '../Def/getFnRef';
import { EFnRefBy, getFuncRef } from '../Def/getFnRef';
import { log } from '../vscWindows/log';

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

    const replaceBy2: boolean = geRenameConfig();

    const fnNameLen: number = DA.name.length;
    const { DocStrMap } = AhkFileData;
    const strList: string[] = [];
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    for (const v of userDefLink) {
        const {
            uri,
            line,
            col,
            by,
        } = v;
        if (by === EFnRefBy.wordWrap) {
            strList.push(DocStrMap[line].textRaw.trim());
            if (!replaceBy2) continue;
        }
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
    if (strList.length > 0) {
        log.warn(
            [
                `rename event "${DA.name}()" -> "${newName}()"`,
                '[',
                ...strList.map((s: string): string => `    ${s}`),
                `] For safety, please check "${DA.name}" case, use ctrl+f search the following case`,
            ].join('\n'),
        );
        log.show();
    } else {
        log.info(`rename event "${DA.name}()" -> "${newName}()"`);
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
        // TODO check newName

        return RenameProviderCore(document, position, newName);
    },
};

/*
 * fn_img_m() && "fn_img_m" && fn_img_m() && fn_img_m() && fn_img_m && fn_img_m && "fn_img_m"
 *     O             O            O              O            X          X              O
 */
