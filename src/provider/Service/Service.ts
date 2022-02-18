import * as vscode from 'vscode';
import { getDebugPath } from '../../configUI';
import { getNowDate } from '../../tools/timeTools';
import { EFileModel, FileManagerRecord } from './fileManager';

function createTemplate(content: string): string {
    const fileName = `temp-${getNowDate(new Date())}.ahk`;

    return FileManagerRecord(fileName, content, EFileModel.WRITE);
}

export function getPathByActive(): string {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) throw new Error('getPathByActive Err --96--11--42');

    if (document.isUntitled) {
        vscode.window.showTextDocument(document.uri);

        return createTemplate(document.getText());
    }
    return document.fileName;
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
