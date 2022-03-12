/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    getIgnoredFile,
    getIgnoredFolder,
} from '../../configUI';
import { getWorkspaceFolders } from './getWorkspaceFolders';

function buildByPath(needPath: Set<string>, buildPath: string): void {
    if (fs.statSync(buildPath).isDirectory()) {
        const files = fs.readdirSync(buildPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                buildByPath(needPath, `${buildPath}/${file}`);
            }
        }
    } else if (!getIgnoredFile(buildPath)) {
        needPath.add(buildPath);
    }
}

export function getUriList(): vscode.Uri[] | null {
    const ahkRootPath: readonly vscode.WorkspaceFolder[] | null = getWorkspaceFolders();
    if (ahkRootPath === null) return null;

    const needPath: Set<string> = new Set<string>();
    ahkRootPath.forEach((folder): void => buildByPath(needPath, folder.uri.fsPath));

    return [...needPath].map((path): vscode.Uri => vscode.Uri.file(path));
}
