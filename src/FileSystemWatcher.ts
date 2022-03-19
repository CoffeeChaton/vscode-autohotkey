/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { BaseScanCache } from './core/BaseScanCache/cache';
import { Detecter } from './core/Detecter';
import { diagColl } from './core/diagRoot';
import { globalValMap } from './core/Global';
import { CollectorFsPath } from './tools/fsTools/getUriList';

function delOldCache(uri: vscode.Uri): void {
    const { fsPath } = uri;
    Detecter.DocMap.delete(fsPath);
    BaseScanCache.cache.delete(fsPath);
    globalValMap.delete(fsPath);
    diagColl.delete(uri);
}

function getChildFiles(fold: string): vscode.Uri[] {
    type TFsPath = string;
    const Collector: Set<TFsPath> = new Set<TFsPath>();
    CollectorFsPath(fold, Collector);

    return [...Collector].map((path0): vscode.Uri => vscode.Uri.file(path0));
}

function getFileList(uri: vscode.Uri): vscode.Uri[] {
    const { fsPath } = uri;

    if (fsPath.endsWith('.ahk')) {
        return [uri];
    }

    if (fs.statSync(fsPath).isDirectory()) {
        return getChildFiles(fsPath);
    }

    console.log('🚀 --15-663--14- unknown ruler', fsPath);

    return [];
}

function wrapUpdateDocDef(uri: vscode.Uri): void {
    const { fsPath } = uri;
    delOldCache(uri);
    if (
        fsPath.endsWith('.ahk')
        && fs.existsSync(fsPath)
    ) {
        void Detecter.updateDocDef(true, fsPath);
    }
}
// ------------------
export const FileSystemWatcher = vscode.workspace.createFileSystemWatcher('*');

FileSystemWatcher.onDidChange((uri: vscode.Uri): void => {
    const uriList = getFileList(uri);
    for (const nUri of uriList) {
        wrapUpdateDocDef(nUri);
    }
});

FileSystemWatcher.onDidCreate((uri: vscode.Uri): void => {
    const uriList = getFileList(uri);
    for (const nUri of uriList) {
        wrapUpdateDocDef(nUri);
    }
});

FileSystemWatcher.onDidDelete((uri: vscode.Uri): void => {
    const uriList = getFileList(uri);
    for (const nUri of uriList) {
        wrapUpdateDocDef(nUri);
    }
});
