/* eslint max-classes-per-file: ["error", 4] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeSpecialChar } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { EMode } from '../tools/globalSet';

type TDefSet = {
    document: vscode.TextDocument;
    position: vscode.Position;
    Mode: EMode;
    word: string;
    DefReg: RegExp;
    usingReg: RegExp;
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

export async function tryGetSymbol(word: string, mode: EMode): Promise<vscode.SymbolInformation | null> {
    const wordLower = word.toLowerCase();
    for (const fsPath of Detecter.getCacheFileUri()) {
        // eslint-disable-next-line no-await-in-loop
        const docSymbolList = await Detecter.getDocDef(fsPath, mode, false);
        if (docSymbolList) {
            for (const AhkSymbol of docSymbolList) {
                if (AhkSymbol.name.toLowerCase() === wordLower) return AhkSymbol;
            }
        }
    }
    return null;
}

class DefCore {
    private static async getDocReference(fileName: string, usingReg: RegExp): Promise<vscode.Location[]> {
        const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fileName));
        const LocationList2: vscode.Location[] = [];
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            const textFix = removeSpecialChar(text).trim();
            const textFixPos = textFix.search(usingReg);
            if (textFixPos > -1) {
                LocationList2.push(new vscode.Location(document.uri, new vscode.Position(line, text.search(usingReg))));
            }
        }
        return LocationList2;
    }

    private static async getReference(usingReg: RegExp): Promise<vscode.Location[]> {
        const List: vscode.Location[] = [];
        for (const fileName of Detecter.getCacheFileUri()) {
            // eslint-disable-next-line no-await-in-loop
            const iLocations = await DefCore.getDocReference(fileName, usingReg);
            for (const iLocation of iLocations) { // for ( vscode.Location of vscode.Location[] )
                List.push(iLocation);
            }
        }
        return List;
    }

    public static async ahkDef(DefSet: TDefSet): Promise<vscode.Location | vscode.Location[] | null> {
        const {
            document, position, Mode, word, DefReg, usingReg,
        } = DefSet;
        const { text } = document.lineAt(position);
        if (text.trim().search(DefReg) > -1) {
            const AhkSymbol = await tryGetSymbol(word, Mode);
            if (AhkSymbol === null) return null;

            if (AhkSymbol.location.uri === document.uri
                && AhkSymbol.location.range.start.line === document.lineAt(position).lineNumber) {
                vscode.window.showInformationMessage('list all using');
                return DefCore.getReference(usingReg);
            }
        }
        if (text.trim().search(usingReg) > -1) {
            const AhkSymbol = await tryGetSymbol(word, Mode);
            if (AhkSymbol === null) return null;

            vscode.window.showInformationMessage('goto Def');
            return new vscode.Location(AhkSymbol.location.uri, new vscode.Position(AhkSymbol.location.range.start.line, 0));
        }
        return null;
    }
}
class Def {
    public static async funcDef(document: vscode.TextDocument, position: vscode.Position, word: string)
        : Promise<vscode.Location | vscode.Location[] | null> {
        // funcName( | Func("funcName" , not search class.Method()
        const DefReg = new RegExp(`(?<!\\.)\\b(${word})\\(|(?:(?<=\\bfunc\\()["']\\b(${word})\\b["'])`, 'i');
        // funcName( | Func("funcName"
        const usingReg = new RegExp(`(?:(?<!\\.)\\b(${word})\\()|(?:(?<=\\bfunc\\()["']\\b(${word})\\b["'])`, 'i');
        const Mode = EMode.ahkFunc;
        const funcDefSet = {
            document, position, Mode, word, DefReg, usingReg,
        };
        return DefCore.ahkDef(funcDefSet);
    }

    public static async classDef(document: vscode.TextDocument, position: vscode.Position, word: string)
        : Promise<vscode.Location | vscode.Location[] | null> {
        // class ClassName
        const DefReg = new RegExp(`^class\\b\\s\\s*\\b(${word})\\b`, 'i');
        // new className | className. | extends  className | global className
        // eslint-disable-next-line max-len
        const usingReg = new RegExp(`(?:\\bnew\\s\\s*\\b(${word})\\b)|(?:(${word})\\.)|(?:\\bextends\\b\\s\\s*(${word}))|(?:\\bglobal\\b\\s\\s*\\b(${word})\\b)`, 'i');
        const Mode = EMode.ahkClass;
        const classDefSet = {
            document, position, Mode, word, DefReg, usingReg,
        };
        return DefCore.ahkDef(classDefSet);
    }
}

export class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const fileLink = await ahkInclude(document, position);
        if (fileLink) return fileLink;

        const funcLink = await Def.funcDef(document, position, word);
        if (funcLink) return funcLink;

        const classLink = await Def.classDef(document, position, word);
        if (classLink) return classLink;

        // return ahk Built-in func
        // TODO GoSub  GoTo
        return null;
    }
}
