/* eslint-disable no-await-in-loop */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeSpecialChar2 } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';

export default class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line no-unused-vars
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken)
        : Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
        const fileLink = await this.tryGetFileLink(document, position);
        if (fileLink) return fileLink;

        const methodLink = await this.tryGetFuncWrapper(document, position);
        if (methodLink) return methodLink;

        // TODO search class
        // return ahk Built-in func
        // for ()...
        return null;
    }

    // eslint-disable-next-line class-methods-use-this
    private async tryGetFileLink(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location | null> {
        const { text } = document.lineAt(position);
        const includeMatch = text.trim().match(/(?<=#include).+?\.(ahk|ext)\b/i);
        if (includeMatch) {
            const length = Math.max(document.uri.path.lastIndexOf('/'), document.uri.path.lastIndexOf('\\'));
            if (length <= 0) return null;
            const parent = document.uri.path.substr(0, length);
            const uri = vscode.Uri.file(includeMatch[0].replace(/(%A_ScriptDir%|%A_WorkingDir%)/, parent));
            return new vscode.Location(uri, new vscode.Position(0, 0));
        }
        return null;
    }

    // eslint-disable-next-line class-methods-use-this
    public async tryGetSymbol(document: vscode.TextDocument, word: string): Promise<vscode.SymbolInformation | null> {
        for (const AhkFunc of await Detecter.getFuncList(document.uri)) {
            if (AhkFunc.name.toLowerCase() === word) return AhkFunc;
        }
        for (const fileName of Detecter.getCacheFileUri()) {
            for (const AhkFunc of await Detecter.getFuncList(vscode.Uri.file(fileName))) {
                if (AhkFunc.name.toLowerCase() === word) return AhkFunc;
            }
        }
        return null;
    }

    private async tryGetFuncWrapper(document: vscode.TextDocument, position: vscode.Position)
        : Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
        const { text } = document.lineAt(position);
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const wordReg = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'ig'); // not search class.Method()
        if (text.search(wordReg) === -1) return null;

        const AhkFunc = await this.tryGetSymbol(document, word);
        if (AhkFunc) {
            if (AhkFunc.location.uri === document.uri && AhkFunc.location.range.start.line === document.lineAt(position).lineNumber) {
                return this.AhkFuncReference(wordReg);
            }
            return new vscode.Location(AhkFunc.location.uri, AhkFunc.location.range.start);
        }
        return null;
    }

    // eslint-disable-next-line class-methods-use-this
    public async getFuncReference(fileName: string, wordReg: RegExp): Promise<vscode.Location[]> {
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

    public async AhkFuncReference(wordReg: RegExp): Promise<vscode.Location[]> {
        const List: vscode.Location[] = [];
        for (const fileName of Detecter.getCacheFileUri()) {
            // eslint-disable-next-line no-await-in-loop
            const iLocations = await this.getFuncReference(fileName, wordReg);
            for (const iLocation of iLocations) { // for ( vscode.Location of vscode.Location[] )
                List.push(iLocation);
            }
        }
        return List;
    }
}
