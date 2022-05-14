/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { getIgnoredList } from '../../configUI';
import { getWorkspaceFolders } from './getWorkspaceFolders';

type TFsPath = string;

export function fsPathIsAllow(fsPath: string, blockList: readonly RegExp[]): boolean {
    // OutputChannel.appendLine(fsPath);
    for (const reg of blockList) {
        if (reg.test(fsPath)) return false;
    }
    return true;
}

function CollectorFsPath(fsPath: TFsPath, blockList: readonly RegExp[], Collector: Set<TFsPath>): void {
    const Stats: fs.Stats = fs.statSync(fsPath);
    if (Stats.isDirectory()) {
        const files: string[] = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext: TFsPath = `${fsPath}/${file}`;
            if (fsPathIsAllow(fsPathNext, blockList)) {
                CollectorFsPath(fsPathNext, blockList, Collector);
            }
        }
    } else if (Stats.isFile() && fsPath.endsWith('.ahk')) {
        Collector.add(fsPath);
    }
}

export function getUriList(): vscode.Uri[] | null {
    const WorkspaceFolderList: readonly vscode.WorkspaceFolder[] | null = getWorkspaceFolders();
    if (WorkspaceFolderList === null) return null;

    const blockList: readonly RegExp[] = getIgnoredList();
    const Collector: Set<TFsPath> = new Set<TFsPath>();

    for (const folder of WorkspaceFolderList) {
        const rootFsPath: string = folder.uri.fsPath.replaceAll('\\', '/');
        CollectorFsPath(rootFsPath, blockList, Collector);
    }

    return [...Collector].map((path0: string): vscode.Uri => vscode.Uri.file(path0));
}
