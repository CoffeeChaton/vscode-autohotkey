import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';

export async function ahkRenameFiles(e: vscode.FileRenameEvent): Promise<void> {
    await Detecter.renameFileName(e);
}
