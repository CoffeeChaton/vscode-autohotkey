/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-await-in-loop */
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
    getIgnoredFile,
    getIgnoredFolder,
} from '../../configUI';
import { Detecter } from '../../core/Detecter';

export async function buildByPathAsync(showMsg: boolean, buildPath: string, useDeepAnalysis: boolean): Promise<void> {
    if (fs.statSync(buildPath).isDirectory()) {
        const files = fs.readdirSync(buildPath);
        for (const file of files) {
            if (!getIgnoredFolder(file)) {
                await buildByPathAsync(showMsg, `${buildPath}/${file}`, useDeepAnalysis);
            }
        }
    } else if (!getIgnoredFile(buildPath)) {
        // const Uri = vscode.Uri.file(buildPath);
        await Detecter.updateDocDef(showMsg, vscode.Uri.file(buildPath).fsPath, useDeepAnalysis);
    }
}
