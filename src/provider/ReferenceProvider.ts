/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { isPosAtStr } from '../tools/isPosAtStr';
import { userDef } from './Def/DefProvider';
import { getValDefInFunc } from './Def/getValDefInFunc';

export class ReferenceProvider implements vscode.ReferenceProvider {
    //  Go to References search (via Shift+F12),
    public async provideReferences(document: vscode.TextDocument, position: vscode.Position,
        context: vscode.ReferenceContext, token: vscode.CancellationToken): Promise<vscode.Location[] | null> {
        if (isPosAtStr(document, position)) return null;

        const range = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w\w*\b(?!%)/);
        if (!range) return null;
        const wordLower = document.getText(range).toLowerCase();
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func

        const listAllUsing = true;
        const userDefLink = await userDef(document, position, wordLower, listAllUsing);
        if (userDefLink) return userDefLink;

        const valInFunc = getValDefInFunc(document, position, wordLower, listAllUsing);
        if (valInFunc) return valInFunc;
        return null;
    }
}
