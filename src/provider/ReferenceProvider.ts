import type * as vscode from 'vscode';
import { isPosAtStr } from '../tools/isPosAtStr';
import { userDefFunc } from './Def/DefProvider';
import { getClassDef } from './Def/getClassDef';
import { posAtLabelDef } from './Def/getDefWithLabel';
import { getValDefInFunc } from './Def/getValDefInFunc';

function ReferenceProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    if (isPosAtStr(document, position)) return null;

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/ui);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    const labelRef: vscode.Location[] | null = posAtLabelDef(document, position, wordUp);
    if (labelRef !== null) return labelRef;

    const listAllUsing = true;
    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
    if (userDefLink !== null) return userDefLink;

    const classDef: vscode.Location[] | null = getClassDef(wordUp, listAllUsing);
    if (classDef !== null) return classDef; // class name is variable name, should before function.variable name

    const valInFunc: vscode.Location[] | null = getValDefInFunc(document, position, wordUp, listAllUsing);
    if (valInFunc !== null) return valInFunc;
    return null;
}

//  Go to References search (via Shift+F12),
export const ReferenceProvider: vscode.ReferenceProvider = {
    provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        _context: vscode.ReferenceContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Location[]> {
        return ReferenceProviderCore(document, position);
    },
};
