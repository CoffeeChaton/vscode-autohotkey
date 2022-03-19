/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getIgnored } from '../../configUI';
import { getWorkspaceFolders } from './getWorkspaceFolders';

type TFsPath = string;

export function CollectorFsPath(fsPath: TFsPath, Collector: Set<TFsPath>): void {
    if (fs.statSync(fsPath).isDirectory()) {
        const files = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext: TFsPath = path.join(fsPath, file);
            if (!getIgnored(fsPathNext)) {
                CollectorFsPath(fsPathNext, Collector);
            }
        }
    } else if (fsPath.endsWith('.ahk') && !getIgnored(fsPath)) {
        Collector.add(fsPath);
    }
}

export function getUriList(): vscode.Uri[] | null {
    const WorkspaceFolderList: readonly vscode.WorkspaceFolder[] | null = getWorkspaceFolders();
    if (WorkspaceFolderList === null) return null;

    const Collector: Set<TFsPath> = new Set<TFsPath>();
    WorkspaceFolderList.forEach((folder): void => CollectorFsPath(folder.uri.fsPath, Collector));

    return [...Collector].map((path0): vscode.Uri => vscode.Uri.file(path0));
}
