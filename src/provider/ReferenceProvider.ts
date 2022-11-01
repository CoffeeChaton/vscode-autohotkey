import type * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { isPosAtStrNext } from '../tools/isPosAtStr';
import { userDefFunc } from './Def/DefProvider';
import { getClassDef } from './Def/getClassDef';
import { posAtLabelDef } from './Def/getDefWithLabel';
import { getRefSwitch } from './Def/getRefSwitch';
import { getValDefInFunc } from './Def/getValDefInFunc';

function ReferenceProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const { DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    const { textRaw, lStr } = DocStrMap[position.line];
    if (isPosAtStrNext(textRaw, lStr, position)) return null;

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/ui);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    const labelRef: vscode.Location[] | null = posAtLabelDef(document, position, wordUp);
    if (labelRef !== null) return labelRef;

    const swLoc: vscode.Location[] | null = getRefSwitch(document, position, wordUp);
    if (swLoc !== null) return swLoc;

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
