/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    getIgnoredFile,
    getIgnoredFolder,
} from '../configUI';
import { Detecter } from './Detecter';

export function buildByPath(buildPath: string, useDeepAnalysis: boolean): void {
    if (fs.statSync(buildPath).isDirectory()) {
        const files = fs.readdirSync(buildPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                buildByPath(`${buildPath}/${file}`, useDeepAnalysis);
            }
        }
    } else if (!getIgnoredFile(buildPath)) {
        // const Uri = vscode.Uri.file(buildPath);
        void Detecter.updateDocDef(false, vscode.Uri.file(buildPath).fsPath, useDeepAnalysis);
    }
}
