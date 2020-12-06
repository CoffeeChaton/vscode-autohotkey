import * as vscode from 'vscode';
import { userDef } from './Def/DefProvider';
import { getValDefInFunc } from './Def/getValDefInFunc';

export class ReferenceProvider implements vscode.ReferenceProvider {
    //  Go to References search (via Shift+F12),
    public async provideReferences(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: vscode.ReferenceContext, token: vscode.CancellationToken): Promise<vscode.Location[] | null> {
        const wordLower = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func

        const listAllUsing = true;
        const userDefLink = await userDef(document, position, wordLower, listAllUsing);
        if (userDefLink) return userDefLink;

        const valInFunc = getValDefInFunc(document, position, wordLower, listAllUsing);
        if (valInFunc) return valInFunc;
        return null;
    }
}
