/* eslint max-classes-per-file: ["error", 4] */
/* eslint-disable no-await-in-loop */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeSpecialChar2 } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { EMode } from '../tools/globalSet';

// fnType is type of  Detecter.getDocDef
type fnType = { (uri: vscode.Uri, mode: EMode): Promise<vscode.SymbolInformation[] | null> };

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

async function tryGetSymbol(document: vscode.TextDocument, word: string, func: fnType, mode: EMode): Promise<vscode.SymbolInformation | null> {
    const thisDoc = await func(document.uri, mode);
    if (thisDoc) {
        for (const AhkSymbol of thisDoc) {
            if (AhkSymbol.name.toLowerCase() === word) return AhkSymbol;
        }
    }

    for (const fileName of Detecter.getCacheFileUri()) {
        const tempDoc = await func(vscode.Uri.file(fileName), mode);
        if (tempDoc) {
            for (const AhkSymbol of tempDoc) {
                if (AhkSymbol.name.toLowerCase() === word) return AhkSymbol;
            }
        }
    }
    return null;
}

class Share {
    private static async getDocReference(fileName: string, wordReg: RegExp): Promise<vscode.Location[]> {
        const document = await vscode.workspace.openTextDocument(fileName);
        const LocationList2: vscode.Location[] = [];
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;
            const textFix = removeSpecialChar2(text).trim();
            const textFixPos = textFix.search(wordReg);
            if (textFixPos > -1) {
                LocationList2.push(new vscode.Location(document.uri, new vscode.Position(line, text.search(wordReg))));
            }
        }
        return LocationList2;
    }

    public static async getReference(wordReg: RegExp): Promise<vscode.Location[]> {
        const List: vscode.Location[] = [];
        for (const fileName of Detecter.getCacheFileUri()) {
            // eslint-disable-next-line no-await-in-loop
            const iLocations = await Share.getDocReference(fileName, wordReg);
            for (const iLocation of iLocations) { // for ( vscode.Location of vscode.Location[] )
                List.push(iLocation);
            }
        }
        return List;
    }
}
class staticDef {
    public static async ahkFuncDef(document: vscode.TextDocument, position: vscode.Position)
        : Promise<vscode.Location | vscode.Location[] | null> {
        const { text } = document.lineAt(position);
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const wordReg = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'ig'); // not search class.Method()
        if (text.search(wordReg) === -1) return null; // is not func def or using

        const AhkFunc = await tryGetSymbol(document, word, Detecter.getDocDef, EMode.ahkFunc);
        if (AhkFunc === null) return null;

        if (AhkFunc.location.uri === document.uri
            && AhkFunc.location.range.start.line === document.lineAt(position).lineNumber) {
            return Share.getReference(wordReg); //  Func using
        }
        return new vscode.Location(AhkFunc.location.uri, new vscode.Position(AhkFunc.location.range.start.line, 0));
        //  return AhkFunc.location; //  Func Def
    }

    public static async ahkClassDef(document: vscode.TextDocument, position: vscode.Position)
        : Promise<vscode.Location | vscode.Location[] | null> {
        const { text } = document.lineAt(position);
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        // TODO in ahkClassMap
        // class def is ... class ClassName
        const DefReg = new RegExp(`^class\\b\\s\\s*\\b(${word})\\b`, 'i');
        // new className | className. | extends  className | global className
        // OK            | OK          | ?                  | NOT
        // eslint-disable-next-line max-len
        const usingReg = new RegExp(`(?:\\bnew\\s\\s*\\b(${word})\\b)|(?:(${word})\\.)|(?:\\bextends\\b\\s\\s*(${word}))|(?:\\bglobal\\b\\s\\s*\\b(${word})\\b)`, 'i');
        if (text.trim().search(DefReg) > -1) {
            // TODO call class using
            const AhkClass = await tryGetSymbol(document, word, Detecter.getDocDef, EMode.ahkClass);
            if (AhkClass === null) return null;
            if (AhkClass.location.uri === document.uri
                && AhkClass.location.range.start.line === document.lineAt(position).lineNumber) {
                return Share.getReference(usingReg); //  Func using
            }
            vscode.window.showInformationMessage('ahkClassDef can\'t list all using Now');
        }
        if (text.search(usingReg) > -1) {
            const AhkClass = await tryGetSymbol(document, word, Detecter.getDocDef, EMode.ahkClass);
            if (AhkClass === null) return null;
            vscode.window.showInformationMessage('goto ahkClassDef');
            return new vscode.Location(AhkClass.location.uri, new vscode.Position(AhkClass.location.range.start.line, 0));
        }
        // class using
        return null;
    }
}

export default class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
        const fileLink = await ahkInclude(document, position);
        if (fileLink) return fileLink;

        const funcLink = await staticDef.ahkFuncDef(document, position);
        if (funcLink) return funcLink;

        const ahkClassLink = await staticDef.ahkClassDef(document, position);
        if (ahkClassLink) return ahkClassLink;

        // TODO return ahk Built-in func

        return null;
    }

    public static async tryGetSymbol(document: vscode.TextDocument, word: string, mode: EMode): Promise<vscode.SymbolInformation | null> {
        switch (mode) {
            case EMode.ahkFunc: // TODO enum tryGetSymbol
                return tryGetSymbol(document, word, Detecter.getDocDef, EMode.ahkFunc);
            default:
                return null;
        }
    }
}
