import * as vscode from 'vscode';
import { Detecter } from '../Detecter';
import { diagColl } from './diagRoot';

export function onClosetDocClearDiag(fsPath: string): void {
    const uri = vscode.Uri.file(fsPath);

    if (uri.fsPath.endsWith('.ahk')) {
        diagColl.delete(uri);
        void Detecter.updateDocDef(false, fsPath, false);
    }

    if (uri.fsPath.endsWith('.ahk.git')) {
        diagColl.delete(uri);

        const uriWithOutGit = vscode.Uri.file(fsPath.replace(/\.ahk\.git$/ui, '.ahk'));
        diagColl.delete(uriWithOutGit);
        void Detecter.updateDocDef(false, uriWithOutGit.fsPath, false);
    }
}
