/* eslint-disable class-methods-use-this */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import getSymbolEndLine from '../tools/getSymbolEndLine';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { showTimeSpend } from '../configUI';


export default class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line no-unused-vars
    provideDocumentSymbols(document: vscode.TextDocument, _token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        const timeStart = Date.now();
        const lineCount = Math.min(document.lineCount, 10000);
        const result: vscode.SymbolInformation[] = [];
        let CommentBlock = false;
        let BodyEndLine: number = 0;

        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);

            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;

            const CommentBlockSymbol = this.getCommentBlockSymbol(document, line, lineCount, text);
            if (CommentBlockSymbol) result.push(CommentBlockSymbol); // don't continue

            const textFix = removeSpecialChar(text, false);
            if (textFix.trim() === '') continue;
            if (getSkipSign(textFix)) continue;

            if (line >= BodyEndLine) {
                const func = Detecter.getFuncByLine(document, line, lineCount);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    result.push(func);
                    continue;
                }
            }

            const BlockSymbol = this.getSymbol(document, line, lineCount, textFix);
            if (BlockSymbol) result.push(BlockSymbol);
        }
        showTimeSpend(document.uri.fsPath, timeStart);
        return result;
    }

    private getSymbol(document: vscode.TextDocument, line: number, lineCount: number,
        textFix: string): vscode.SymbolInformation | null {
        const textP = textFix.trim();
        const { length } = document.lineAt(line).text;
        const {
            matchList, findBlockList, kindList, nameList,
        } = this;
        for (let i = 0; i < matchList.length; i += 1) {
            const BlockSymbol = textP.match(matchList[i]);
            if (BlockSymbol) {
                const startPos = new vscode.Position(line, 0);
                const Range = findBlockList[i]
                    ? getSymbolEndLine(document, line, lineCount, startPos)
                    : new vscode.Range(startPos, new vscode.Position(line, length));
                return new vscode.SymbolInformation(`${nameList[i]}${BlockSymbol[1]}`,
                    kindList[i], '', new vscode.Location(document.uri, Range));
            }
        }
        return null;
    }

    private getCommentBlockSymbol(document: vscode.TextDocument,
        line: number, lineCount: number, text: string): vscode.SymbolInformation | null {
        const kind = vscode.SymbolKind.Package;

        const CommentBlockRegex = /^\{\s\s*;;/;
        const CommentBlock = text.trim().search(CommentBlockRegex);
        if (CommentBlock > -1) {
            const name = text.substring(text.indexOf(';;') + 2).trim();
            const startPos = new vscode.Position(line, 0);
            const Range = getSymbolEndLine(document, line, lineCount, startPos);
            return new vscode.SymbolInformation(name, kind, '',
                new vscode.Location(document.uri, Range));
        }

        const CommentLine = text.indexOf(';;');
        if (CommentLine > -1) {
            const name = text.substring(CommentLine).trim();
            const startPos = new vscode.Position(line, CommentLine);
            const Range = new vscode.Range(startPos, new vscode.Position(line, text.length));
            return new vscode.SymbolInformation(name, kind, '',
                new vscode.Location(document.uri, Range));
        }

        return null;
    }

    private readonly matchList: readonly RegExp[] = [
        /^class[\s,][\s,]*(\w\w*)/i,
        /^loop[\s,%][\s,%]*(\w\w*)/i,
        /^for[\s,\w]+in\s\s*(\w\w*)/i,
        /^switch\s\s*(\w\w*)/i,
        // ----------------------
        /^static\b(\w\w*)/i,
        /^return[\s,][\s,]*(.+)/i,
        /^case\s\s*(.+):/i,
        /^default(\s)\s*:/i,
        /^GoSub[\s,][\s,]*(\w\w*)/i,
        /^GoTo[\s,][\s,]*(\w\w*)/i,
        /^(\w.?\w):$/, // Label:
        /:=\s*new\s\s*(\w\w*)/i, //  := new
        /^:[^:]*:([^:][^:]*)::/, // HotStr
        /^([^:][^:]*)::/, // HotKeys
        /^#(\w\w*)/, // directive
        /^global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^throw[\s,][\s,]*(.+)/i, // throw
    ];

    private readonly nameList: readonly string[] = [
        'Class ',
        'Loop ',
        'For ',
        'Switch ',
        //--------------------------
        'Static ',
        'Return ',
        'Case ', // TODO Case Block use switch deep
        'Default',
        'GoSub ',
        'GoTo ',
        'Label ',
        'new ',
        '', // HotStr
        '', // HotKeys
        '#', // directive
        'global ',
        'Throw ',
    ];

    private readonly kindList: readonly vscode.SymbolKind[] = [
        // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
        vscode.SymbolKind.Class,
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        //--------------
        vscode.SymbolKind.Variable, // Static
        vscode.SymbolKind.Variable, // Return
        vscode.SymbolKind.Variable, // Case
        vscode.SymbolKind.Variable, // Default
        vscode.SymbolKind.Variable, // GoSub
        vscode.SymbolKind.Variable, // GoTo
        vscode.SymbolKind.Package, // Label
        vscode.SymbolKind.Class, // not Object  is feature
        vscode.SymbolKind.Event, // HotStr
        vscode.SymbolKind.Event, // HotKeys
        vscode.SymbolKind.Event, // directive
        vscode.SymbolKind.Variable, // Global
        vscode.SymbolKind.Event, // Throw
    ];

    private readonly findBlockList: readonly boolean[] = [
        true,
        true,
        true,
        true,
        //----------------
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ];
}
