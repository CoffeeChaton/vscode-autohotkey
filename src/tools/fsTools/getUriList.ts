/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { getIgnoredList } from '../../configUI';
import { getWorkspaceFolders } from './getWorkspaceFolders';

type TFsPath = string;

function checkMM(fsPath: string, blockList: readonly string[]): boolean {
    return !mm.isMatch(fsPath, blockList);
}

export function CollectorFsPath(fsPath: TFsPath, blockList: readonly string[], Collector: Set<TFsPath>): void {
    if (fs.statSync(fsPath).isDirectory()) {
        const files: string[] = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext: TFsPath = path.join(fsPath, file);
            if (checkMM(fsPathNext, blockList)) {
                CollectorFsPath(fsPathNext, blockList, Collector);
            }
        }
    } else if (fsPath.endsWith('.ahk') && checkMM(fsPath, blockList)) {
        Collector.add(fsPath);
    }
}

export function getUriList(): vscode.Uri[] | null {
    const WorkspaceFolderList: readonly vscode.WorkspaceFolder[] | null = getWorkspaceFolders();
    if (WorkspaceFolderList === null) return null;

    const blockList: readonly string[] = getIgnoredList();
    const Collector: Set<TFsPath> = new Set<TFsPath>();
    WorkspaceFolderList.forEach(
        (folder: vscode.WorkspaceFolder): void => CollectorFsPath(folder.uri.fsPath, blockList, Collector),
    );

    return [...Collector].map((path0: string): vscode.Uri => vscode.Uri.file(path0));
}
