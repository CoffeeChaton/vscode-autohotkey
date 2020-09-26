import * as vscode from 'vscode';
import { userDef } from './Def/DefProvider';

export class ReferenceProvider implements vscode.ReferenceProvider {
    //  Go to References search (via Shift+F12),
    // eslint-disable-next-line class-methods-use-this
    public provideReferences(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[] | undefined> {
        const wordLower = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func

        const listAllUsing = true;
        return userDef(document, position, wordLower, listAllUsing);
    }
}
