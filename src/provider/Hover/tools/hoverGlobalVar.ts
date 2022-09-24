/* eslint-disable max-statements */
import path from 'node:path';
import * as vscode from 'vscode';
import type { TGlobalVal } from '../../../core/ParserTools/ahkGlobalDef';
import { pm } from '../../../core/ProjectManager';

export function hoverGlobalVar(wordUp: string): vscode.MarkdownString | null {
    const msg: string[] = [];
    for (const { GValMap, uri } of pm.getDocMapValue()) {
        const gVal: Readonly<TGlobalVal> | undefined = GValMap.get(wordUp);
        if (gVal !== undefined) {
            const fsPath: string = uri.toString();
            msg.push(`- [${path.basename(fsPath)}](${fsPath})`);
        }
    }

    if (msg.length === 0) return null;
    const md: vscode.MarkdownString = new vscode.MarkdownString('Maybe is Global variables?', true)
        .appendCodeblock(`global ${wordUp}`);

    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    md.appendMarkdown(msg.sort().join('\n'));

    return md;
}
