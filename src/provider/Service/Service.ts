/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable immutable/no-this */
import { resolve } from 'path';
import * as vscode from 'vscode';
import { getDebugPath } from '../../configUI';

import { getNowDate } from '../../tools/timeTools';
import { EFileModel, FileManagerRecord } from './fileManager';
import { Process } from './Process';

function createTemplate(content: string): string {
    const fileName = `temp-${getNowDate(new Date())}.ahk`;
    const ed: string = FileManagerRecord(fileName, content, EFileModel.WRITE);
    return ed;
}

function checkAndSaveActive(): void {
    if (!vscode.window?.activeTextEditor?.document.isUntitled) {
        vscode.commands.executeCommand('workbench.action.files.save');
    }
}

export function getPathByActive(): string {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) throw new Error('getPathByActive Err --96--11--42');

    if (document.isUntitled) {
        vscode.window.showTextDocument(document.uri);
        const ed = createTemplate(document.getText());
        return ed;
    }
    return document.fileName;
}

/**
 * run script
 * @param path execute script path
 */
async function runAhk(path: string): Promise<void> {
    const executePath = getDebugPath();
    checkAndSaveActive();
    const pathFix = (!path)
        ? getPathByActive()
        : path;

    const command = `"${executePath}" "${pathFix}"`;
    const opt = { cwd: `${resolve(pathFix, '..')}` };
    await Process(command, opt);
}

function runSelection(): void {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (!editor) {
        const msg = 'Not active editor found! --33--19--83 --neko-help';
        vscode.window.showErrorMessage(msg);
        throw new Error(msg);
    }

    const { selection } = editor;
    const text = editor.document.getText(selection);
    runAhk(createTemplate(text));
}

/**
 * start debuggin session
 */
export function startDebugger(script: string): void {
    const cwd: vscode.Uri | undefined = script
        ? vscode.Uri.file(script)
        : vscode.window?.activeTextEditor?.document.uri;
    if (!cwd) {
        const msg = 'please open .ahk file to startDebugger --66--77--30 by neko-help';
        vscode.window.showErrorMessage(msg);
        throw new Error(msg);
    }

    vscode.debug.startDebugging(
        vscode.workspace.getWorkspaceFolder(cwd),
        {
            type: 'ahk',
            request: 'launch',
            name: 'Autohotkey Debugger',
            runtime: getDebugPath(),
            program: script || getPathByActive(),
        },
    );
}
