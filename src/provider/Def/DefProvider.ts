/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-regexp */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { EMode, MyDocSymbol } from '../../globalEnum';
import { ahkInclude } from './ahkInclude';
import { kindCheck } from './kindCheck';
import { getValDefInFunc } from './getValDefInFunc';

type DefObj = Readonly<{
    document: vscode.TextDocument,
    position: vscode.Position,
    Mode: EMode,
    wordLower: string,
    defReg: RegExp,
    usingReg: RegExp,
    timeStart: number,
    listAllUsing: boolean
}>;

export function tryGetSymbol(wordLower: string, mode: EMode): false | { fsPath: string, AhkSymbol: MyDocSymbol } {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const docSymbolList = Detecter.getDocMap(fsPath);
        if (docSymbolList === undefined) continue;
        const iMax = docSymbolList.length;
        for (let i = 0; i < iMax; i++) {
            if (kindCheck(mode, docSymbolList[i].kind) === true
                && docSymbolList[i].name.toLowerCase() === wordLower) {
                return { AhkSymbol: docSymbolList[i], fsPath };
            }
        }
    }
    return false;
}

async function getReference(usingReg: RegExp, timeStart: number, wordLower: string): Promise<vscode.Location[]> {
    const List: vscode.Location[] = [];
    const fsPathList = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const textRawList = document.getText().split('\n');
        const lineCount = textRawList.length;
        for (let line = 0; line < lineCount; line++) {
            const textRaw = textRawList[line].trim();
            if (usingReg.test(textRaw)) {
                List.push(new vscode.Location(document.uri,
                    new vscode.Position(line, textRawList[line].search(usingReg))));
            }
        }
    }
    const debugStr = `list all using of ${wordLower} (${Date.now() - timeStart} ms)`;
    console.log(debugStr);
    // vscode.window.showInformationMessage(debugStr);
    return List;
}

// eslint-disable-next-line max-params
async function ahkDef(
    {
        document,
        position,
        Mode,
        wordLower,
        defReg,
        usingReg,
        timeStart,
        listAllUsing,
    }: DefObj,
): Promise<false | vscode.Location[]> {
    const textTrimLower = document.lineAt(position).text.trim().toLowerCase();
    const EModeSymbol = tryGetSymbol(wordLower, Mode);
    if (EModeSymbol === false) return false;
    const { AhkSymbol, fsPath } = EModeSymbol;

    // searchDef
    const searchDef = (): false | Promise<vscode.Location[]> => {
        if (defReg.test(textTrimLower) === false) return false;
        if (listAllUsing
            || (fsPath === document.uri.fsPath
                && AhkSymbol.range.start.line === document.lineAt(position).lineNumber)) {
            return getReference(usingReg, timeStart, wordLower);
        }
        return false;
    };
    // searchUsing
    const searchUsing = (): false | vscode.Location[] => {
        if (textTrimLower.search(usingReg) === -1) return false;
        const debugStr = `goto Def of ${wordLower} (${Date.now() - timeStart} ms)`;
        console.log(debugStr);
        // vscode.window.showInformationMessage(debugStr);
        const Uri = vscode.Uri.file(fsPath);
        return [new vscode.Location(Uri, AhkSymbol.range)];
    };

    const Def = searchDef();
    if (Def !== false) return Def;

    const Using = searchUsing();
    if (Using !== false) return Using;

    return false;
}

export async function userDef(document: vscode.TextDocument,
    position: vscode.Position, wordLower: string, listAllUsing: boolean): Promise<null | vscode.Location[]> {
    const timeStart = Date.now();
    // isDef: (textTrim: string) => boolean
    // TODO get def of AST
    const defRefList: RegExp[] = [
        // class ClassName
        new RegExp(`class\\b\\s\\s*\\b(${wordLower})\\b`, 'i'),
        // funcName( , not search class.Method()
        new RegExp(`(?<!\\.)\\b(${wordLower})\\(`, 'i'),
        // global var_name :=
        new RegExp(`global\\s\\s*(${wordLower})\\s\\s*:?=`, 'i'),
    ];

    const usingRegList: RegExp[] = [
        // eslint-disable-next-line max-len
        new RegExp(`(?:^class\\b\\s\\s*\\b(${wordLower})\\b)|(?:\\bnew\\s\\s*\\b(${wordLower})\\b)|(?:(${wordLower})\\.)|(?:\\bextends\\b\\s\\s*(${wordLower}))|(?:\\bglobal\\b\\s\\s*\\b(${wordLower})\\b)|(?:\\{\\s*base:\\s*(${wordLower}))|(?:\\w\\w*\\.base\\s*:=\\s*(${wordLower}))`, 'i'),
        // class ClassName | new className | className. | extends  className | global className |  {base: className | .base := baseObject
        new RegExp(`(?:(?<!\\.)\\b(${wordLower})\\()|(?:(?<=\\bfunc\\()["']\\b(${wordLower})\\b["'])`, 'i'),
        // funcName( | Func("funcName"
        new RegExp(`global\\s\\s*(${wordLower})\\b`, 'i'),
        // global var_name
    ];

    const Modes: Readonly<EMode[]> = [
        EMode.ahkClass,
        EMode.ahkFunc,
        EMode.ahkGlobal,
    ];

    const iMax = Modes.length;
    for (let i = 0; i < iMax; i += 1) {
        const Location = await ahkDef({
            document,
            position,
            Mode: Modes[i],
            wordLower,
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
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<null | vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
        const wordLower = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const fileLink = ahkInclude(document, position);
        if (fileLink) return fileLink;

        const listAllUsing = false;
        const userDefLink = await userDef(document, position, wordLower, listAllUsing);
        if (userDefLink) return userDefLink;

        const valInFunc = getValDefInFunc(document, position, wordLower, listAllUsing);
        if (valInFunc) return valInFunc;

        return null;
    }
}
