/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { removeSpecialChar } from '../../tools/removeSpecialChar';
import { inCommentBlock } from '../../tools/inCommentBlock';
import { EMode } from '../../globalEnum';
import { ahkInclude } from './ahkInclude';
import { kindCheck } from './kindCheck';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

type DefObj = {
    document: vscode.TextDocument,
    position: vscode.Position,
    Mode: EMode,
    wordLower: string,
    defReg: RegExp,
    usingReg: RegExp,
    timeStart: number,
    listAllUsing: boolean
};

export function tryGetSymbol(wordLower: string, mode: EMode): { AhkSymbol: DeepReadonly<vscode.DocumentSymbol>, fsPath: string } | false {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const docSymbolList = Detecter.getDocMap(fsPath);
        if (docSymbolList === undefined) continue;
        const iMax = docSymbolList.length;
        for (let i = 0; i < iMax; i += 1) {
            const kind: boolean = kindCheck(mode, docSymbolList[i].kind);
            if (kind && docSymbolList[i].name.toLowerCase() === wordLower) {
                return { AhkSymbol: docSymbolList[i], fsPath };
            }
        }
    }
    return false;
}

async function getReference(usingReg: RegExp, timeStart: number, wordLower: string): Promise<vscode.Location[]> {
    const List: vscode.Location[] = [];
    for (const fsPath of Detecter.getDocMapFile()) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const lineCount = Math.min(document.lineCount, 10000);

        let CommentBlock = false;
        for (let line = 0; line < lineCount; line += 1) {
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            if (CommentBlock) continue;
            const textFix = removeSpecialChar(textRaw).trim();
            if (usingReg.test(textFix)) {
                List.push(new vscode.Location(document.uri, new vscode.Position(line, textRaw.search(usingReg))));
            }
        }
    }

    vscode.window.showInformationMessage(`list all using of ${wordLower} (${Date.now() - timeStart} ms)`);
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
): Promise<vscode.Location[] | false> {
    const textTrim = document.lineAt(position).text.trim().toLowerCase();
    const EModeSymbol = tryGetSymbol(wordLower, Mode);
    if (EModeSymbol === false) return false;
    const { AhkSymbol, fsPath } = EModeSymbol;

    // searchDef
    const searchDef = (): Promise<vscode.Location[]> | false => {
        if (defReg.test(textTrim) === false) return false;
        if (listAllUsing
            || (fsPath === document.uri.fsPath
                && AhkSymbol.range.start.line === document.lineAt(position).lineNumber)) {
            return getReference(usingReg, timeStart, wordLower);
        }
        return false;
    };
    // searchUsing
    const searchUsing = (): vscode.Location[] | false => {
        if (textTrim.search(usingReg) === -1) return false;
        //      console.info(`goto Def of ${word} (${Date.now() - timeStart} ms)`);
        vscode.window.showInformationMessage(`goto Def of ${wordLower} (${Date.now() - timeStart} ms)`);
        const Uri = vscode.Uri.file(fsPath);
        return [new vscode.Location(Uri, new vscode.Position(AhkSymbol.range.start.line, 0))];
    };

    const Def = searchDef();
    if (Def !== false) return Def;

    const Using = searchUsing();
    if (Using !== false) return Using;

    return false;
}

export async function userDef(document: vscode.TextDocument,
    position: vscode.Position, wordLower: string, listAllUsing: boolean): Promise<vscode.Location[] | undefined> {
    const timeStart = Date.now();
    // isDef: (textTrim: string) => boolean
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

    const Modes: DeepReadonly<EMode[]> = [
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
    return undefined;
}

export class DefProvider implements vscode.DefinitionProvider {
    // Go to Definition (via F12 || Ctrl+Click)
    // open the definition to the side with ( via Ctrl+Alt+Click )
    // Peek Definition (via Alt+F12)
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | undefined> {
        const wordLower = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const fileLink = ahkInclude(document, position);
        if (fileLink) return fileLink;

        const listAllUsing = false;
        const userDefLink = await userDef(document, position, wordLower, listAllUsing);
        if (userDefLink) return userDefLink;
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func
        return undefined;
    }
}
