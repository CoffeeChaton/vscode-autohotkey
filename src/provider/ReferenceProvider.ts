/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { getReference } from './DefProvider';

export class ReferenceProvider implements vscode.ReferenceProvider {
    // TODO shift F12
    //  Go to References search (via Shift+F12),
    // eslint-disable-next-line class-methods-use-this
    provideReferences(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location[] | undefined> {
        // const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        // const fileLink = await ahkInclude(document, position);
        // if (fileLink) return fileLink;

        // const userDefLink = await userDef(document, position, word);
        // if (userDefLink) return userDefLink;
        // // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func

        return undefined;
    }
}
