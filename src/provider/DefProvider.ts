/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeSpecialChar } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { EMode } from '../tools/globalSet';

type TDefSet = {
    readonly document: vscode.TextDocument;
    readonly position: vscode.Position;
    readonly Mode: EMode;
    readonly word: string;
    readonly DefReg: RegExp;
    readonly usingReg: RegExp;
    readonly timeStart: number;
};

async function ahkInclude(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | null> {
    const { text } = document.lineAt(position);
    const includeMatch = text.trim().match(/(?<=#include).+?\.\b(?:ahk|ext)\b/i); // at #include line
    if (includeMatch) {
        const length = Math.max(document.uri.path.lastIndexOf('/'), document.uri.path.lastIndexOf('\\'));
        if (length <= 0) return null;
        const parent = document.uri.path.substr(0, length);
        const uri = vscode.Uri.file(includeMatch[0].replace(/(%A_ScriptDir%|%A_WorkingDir%)/, parent));
        return new vscode.Location(uri, new vscode.Position(0, 0));
    }
    return null;
}

export function tryGetSymbol(word: string, mode: EMode): vscode.SymbolInformation | null {
    const wordLower = word.toLowerCase();
    for (const fsPath of Detecter.getCacheFileUri()) {
        const docSymbolList = Detecter.getDocDefQuick(fsPath, mode);
        if (docSymbolList) {
            for (const AhkSymbol of docSymbolList) {
                if (AhkSymbol.name.toLowerCase() === wordLower) return AhkSymbol;
            }
        }
    }
    return null;
}

class DefCore {
    private static async getReference(usingReg: RegExp, timeStart: number, word: string): Promise<vscode.Location[]> {
        const List: vscode.Location[] = [];
        for (const fileName of Detecter.getCacheFileUri()) {
            // eslint-disable-next-line no-await-in-loop
            const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fileName));
            let CommentBlock = false;
            const lineCount = Math.min(document.lineCount, 10000);
            for (let line = 0; line < lineCount; line += 1) {
                const { text } = document.lineAt(line);
                CommentBlock = inCommentBlock(text, CommentBlock);
                if (CommentBlock) continue;
                const textFix = removeSpecialChar(text).trim();
                const textFixPos = textFix.search(usingReg);
                if (textFixPos > -1) {
                    List.push(new vscode.Location(document.uri, new vscode.Position(line, text.search(usingReg))));
                }
            }
        }
        console.info(`list all using of ${word} (${Date.now() - timeStart} ms)`);
        vscode.window.showInformationMessage(`list all using of ${word}`);
        return List;
    }

    public static async ahkDef(DefSet: TDefSet): Promise<vscode.Location | vscode.Location[] | null> {
        const {
            document, position, Mode, word, DefReg, usingReg, timeStart,
        } = DefSet;
        const textTrim = document.lineAt(position).text.trim();
        const AhkSymbol = tryGetSymbol(word, Mode);
        if (AhkSymbol === null) return null;

        const searchDef = () => {
            if (textTrim.trim().search(DefReg) === -1) return null;

            if (AhkSymbol.location.uri === document.uri
                && AhkSymbol.location.range.start.line === document.lineAt(position).lineNumber) {
                return DefCore.getReference(usingReg, timeStart, word);
            }
            return null;
        };
        const searchUsing = () => {
            if (textTrim.trim().search(usingReg) === -1) return null;

            console.info(`goto Def of ${word} (${Date.now() - timeStart} ms)`);
            vscode.window.showInformationMessage(`goto Def of ${word}`);
            return new vscode.Location(AhkSymbol.location.uri, new vscode.Position(AhkSymbol.location.range.start.line, 0));
        };

        const Def = searchDef();
        if (Def !== null) return Def;

        const Using = searchUsing();
        if (Using !== null) return Using;

        return null;
    }
}

async function userDef(document: vscode.TextDocument, position: vscode.Position, word: string): Promise<vscode.Location | vscode.Location[] | null> {
    const timeStart = Date.now();
    const DefRegex: RegExp[] = [
        new RegExp(`^class\\b\\s\\s*\\b(${word})\\b`, 'i'),
        // class ClassName
        new RegExp(`(?<!\\.)\\b(${word})\\(`, 'i'),
        // funcName( , not search class.Method()
    ];

    const usingRegex: RegExp[] = [
        // eslint-disable-next-line max-len
        new RegExp(`(?:\\bnew\\s\\s*\\b(${word})\\b)|(?:(${word})\\.)|(?:\\bextends\\b\\s\\s*(${word}))|(?:\\bglobal\\b\\s\\s*\\b(${word})\\b)|(?:\\{\\s*base:\\s*(${word}))|(?:\\w\\w*\\.base\\s*:=\\s*(${word}))`, 'i'),
        // new className | className. | extends  className | global className |  {base: className | .base := baseObject
        new RegExp(`(?:(?<!\\.)\\b(${word})\\()|(?:(?<=\\bfunc\\()["']\\b(${word})\\b["'])`, 'i'),
        // funcName( | Func("funcName"
    ];
    const Modes: EMode[] = [
        EMode.ahkClass,
        EMode.ahkFunc,
    ];
    const iMax = Modes.length;
    for (let i = 0; i < iMax; i += 1) {
        const DefSet: TDefSet = {
            document, position, Mode: Modes[i], word, DefReg: DefRegex[i], usingReg: usingRegex[i], timeStart,
        };
        // eslint-disable-next-line no-await-in-loop
        const temp = await DefCore.ahkDef(DefSet);
        if (temp) return temp;
    }
    return null;
}

export class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const fileLink = await ahkInclude(document, position);
        if (fileLink) return fileLink;

        const userDefLink = await userDef(document, position, word);
        if (userDefLink) return userDefLink;
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func
        return null;
    }
}
