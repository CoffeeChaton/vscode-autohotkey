/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { EMode, TAhkSymbol, TAhkSymbolList } from '../../globalEnum';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { ahkInclude } from './ahkInclude';
import { getValDefInFunc } from './getValDefInFunc';
import { kindCheck } from './kindCheck';

type DefObj = Readonly<{
    document: vscode.TextDocument;
    position: vscode.Position;
    Mode: EMode;
    wordUp: string;
    defReg: RegExp;
    usingReg: RegExp;
    timeStart: number;
    listAllUsing: boolean;
}>;

export function tryGetSymbol(wordUP: string, mode: EMode): false | { fsPath: string; AhkSymbol: TAhkSymbol } {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        const iMax = AhkSymbolList.length;
        for (let i = 0; i < iMax; i++) {
            if (
                kindCheck(mode, AhkSymbolList[i].kind)
                && AhkSymbolList[i].name.toUpperCase() === wordUP
            ) {
                return { AhkSymbol: AhkSymbolList[i], fsPath };
            }
        }
    }
    return false;
}

async function getReference(usingReg: RegExp, timeStart: number, wordUp: string): Promise<vscode.Location[]> {
    const List: vscode.Location[] = [];
    const fsPathList = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const textRawList = document.getText().split('\n');
        const lineCount = textRawList.length;
        for (let line = 0; line < lineCount; line++) {
            const textRaw = textRawList[line].trim();
            if (usingReg.test(textRaw)) {
                const Location = new vscode.Location(
                    document.uri,
                    new vscode.Position(line, textRawList[line].search(usingReg)),
                );
                List.push(Location);
            }
        }
    }
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 10~15ms
    return List;
}

async function ahkDef(
    {
        document,
        position,
        Mode,
        wordUp,
        defReg,
        usingReg,
        timeStart,
        listAllUsing,
    }: DefObj,
): Promise<false | vscode.Location[]> {
    const textTrimUp = document.lineAt(position).text.trim().toUpperCase();
    const EModeSymbol = tryGetSymbol(wordUp, Mode);
    if (EModeSymbol === false) return false;
    const { AhkSymbol, fsPath } = EModeSymbol;

    // searchDef
    const searchDef = (): false | Promise<vscode.Location[]> => {
        if (!defReg.test(textTrimUp)) return false;
        if (
            listAllUsing
            || (fsPath === document.uri.fsPath
                && AhkSymbol.range.start.line === document.lineAt(position).lineNumber)
        ) {
            return getReference(usingReg, timeStart, wordUp);
        }
        return false;
    };
    // searchUsing
    const searchUsing = (): false | vscode.Location[] => {
        if (textTrimUp.search(usingReg) === -1) return false;
        console.log(`🚀 goto Def of ${AhkSymbol.name} ()`, Date.now() - timeStart, 'ms)'); // < ssd < 1ms
        const Uri = vscode.Uri.file(fsPath);
        return [new vscode.Location(Uri, AhkSymbol.range)];
    };

    const Def = await searchDef();
    if (Def !== false) return Def;

    const Using = searchUsing();
    if (Using !== false) return Using;

    return false;
}

export async function userDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): Promise<null | vscode.Location[]> {
    const timeStart = Date.now();
    // isDef: (textTrim: string) => boolean
    // TODO get def of AST
    const defRefList: RegExp[] = [
        //   new RegExp(`(?<!\\.)\\b(${wordUp})\\(`, 'i'),
        new RegExp(`(?<![.\`%])\\b(${wordUp})\\(`, 'iu'),
        // global var_name :=
        new RegExp(`\\bGlobal\\s+(${wordUp})\\s+:?=`, 'iu'),
    ];

    const usingRegList: RegExp[] = [
        // funcName( | Func("funcName"
        new RegExp(`(?:(?<![.\`%])\\b(${wordUp})\\()|(?<=\bfunc\\()\\s*"\b(wordUp)${wordUp}\b"`, 'iu'),
        // var_name
        new RegExp(`(?<![.\`])\\b(${wordUp})\\b`, 'iu'),
    ];

    const Modes: Readonly<EMode[]> = [
        // EMode.ahkClass,
        EMode.ahkFunc,
        EMode.ahkGlobal,
    ];

    const iMax = Modes.length;
    for (let i = 0; i < iMax; i++) {
        const Location = await ahkDef({
            document,
            position,
            Mode: Modes[i],
            wordUp,
            defReg: defRefList[i],
            usingReg: usingRegList[i],
            timeStart,
            listAllUsing,
        });
        if (Location) return Location;
    }
    return null;
}

// Go to Definition (via F12 || Ctrl+Click)
// open the definition to the side with ( via Ctrl+Alt+Click )
// Peek Definition (via Alt+F12)
export class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): Promise<null | vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
        if (isPosAtStr(document, position)) return null;

        // eslint-disable-next-line security/detect-unsafe-regex
        const range = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (!range) return null;
        const wordUp = document.getText(range).toUpperCase();
        const fileLink = ahkInclude(document, position);
        if (fileLink) return fileLink;

        const listAllUsing = false;
        const userDefLink = await userDef(document, position, wordUp, listAllUsing);
        if (userDefLink) return userDefLink;

        const valInFunc = getValDefInFunc(document, position, wordUp, listAllUsing);
        if (valInFunc) return valInFunc;

        return null;
    }
}
