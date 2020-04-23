/* eslint-disable max-statements */

/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import getLocation from '../tools/getLocation';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { showTimeSpend, getAhkVersion } from '../configUI';


export default class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    provideDocumentSymbols(document: vscode.TextDocument,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        const timeStart = Date.now();
        const lineCount = Math.min(document.lineCount, 10000);
        const result: vscode.SymbolInformation[] = [];
        let CommentBlock = false;
        let BodyEndLine: number = 0;
        const isAHKv2 = getAhkVersion();
        for (let line = 0; line < lineCount; line += 1) {
            const { text } = document.lineAt(line);

            CommentBlock = inCommentBlock(text, CommentBlock);
            if (CommentBlock) continue;

            const CommentBlockSymbol = SymBolProvider.getCommentBlockSymbol(document, line, lineCount, text);
            if (CommentBlockSymbol) result.push(CommentBlockSymbol); // don't continue

            const textFix = removeSpecialChar(text).trim();
            if (textFix === '') continue;
            if (getSkipSign(textFix)) continue;

            const ahkClass = Detecter.getFuncByLine(document, line, lineCount);
            if (ahkClass) {
                result.push(ahkClass);
                continue;
            }

            if (isAHKv2 || line >= BodyEndLine) {
                const func = Detecter.getFuncByLine(document, line, lineCount);
                if (func) {
                    BodyEndLine = func.location.range.end.line;
                    result.push(func);
                    continue;
                }
            }
            const ReturnValue = SymBolProvider.getReturnByLine(document, line, lineCount, textFix);
            if (ReturnValue) result.push(ReturnValue);

            const BlockSymbol = SymBolProvider.getSymbolByLine(document, line, lineCount, textFix);
            if (BlockSymbol) result.push(BlockSymbol);
        }
        showTimeSpend(document.uri, timeStart);

        return result;
    }

    private static getReturnByLine(document: vscode.TextDocument, line: number, lineCount: number,
        textFix: string): vscode.SymbolInformation | null {
        const ReturnMatch = textFix.match(/\breturn\b[\s,][\s,]*(.+)/i);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const Func = name.match(/^(\w\w*)\(/);
            if (Func) {
                name = `${Func[1]}(...)`;
            } else {
                const obj = name.match(/^(\{\s*\w\w*\s*:)/);
                if (obj) name = `obj ${obj[1]}`;
            }
            const Location = new vscode.Location(document.uri, document.lineAt(line).range);
            return new vscode.SymbolInformation(`Return ${name.trim()}`, vscode.SymbolKind.Variable, '', Location);
        }
        return null;
    }

    private static getSymbolByLine(document: vscode.TextDocument, line: number, lineCount: number,
        textFix: string): vscode.SymbolInformation | null {
        const {
            matchList, findBlockList, kindList, nameList,
        } = SymBolProvider;
        for (let i = 0; i < matchList.length; i += 1) {
            const BlockSymbol = textFix.match(matchList[i]);
            if (BlockSymbol) {
                const Location = findBlockList[i]
                    ? getLocation(document, line, line, lineCount)
                    : new vscode.Location(document.uri, document.lineAt(line).range);
                return new vscode.SymbolInformation(`${nameList[i]}${BlockSymbol[1]}`,
                    kindList[i], '', Location);
            }
        }
        return null;
    }

    private static getCommentBlockSymbol(document: vscode.TextDocument,
        line: number, lineCount: number, text: string): vscode.SymbolInformation | null {
        const kind = vscode.SymbolKind.Package;

        const CommentBlock = text.trim().search(/^\{\s\s*;;/);
        if (CommentBlock > -1) {
            const name = text.substr(text.indexOf(';;') + 2).trim();
            return new vscode.SymbolInformation(name, kind, '', getLocation(document, line, line, lineCount));
        }

        const CommentLine = text.indexOf(';;');
        if (CommentLine > -1) {
            const name = text.substr(CommentLine + 2).trim();
            const Range = new vscode.Range(new vscode.Position(line, CommentLine), new vscode.Position(line, text.length));
            return new vscode.SymbolInformation(name, kind, '', new vscode.Location(document.uri, Range));
        }

        return null;
    }

    private static readonly matchList: readonly RegExp[] = [
        /^loop[\s,%][\s,%]*(\w\w*)/i,
        /^for[\s,\w]+in\s\s*(\w\w*)/i,
        /^switch\s\s*(\w\w*)/i,
        // ----------------------
        /^static\b(\w\w*)/i,
        /^case\s\s*[^:]+:/i,
        /^default(\s)\s*:/i,
        /^GoSub[\s,][\s,]*(\w\w*)/i,
        /^GoTo[\s,][\s,]*(\w\w*)/i,
        /^(\w.?\w):$/, // Label:
        /\bnew\b\s\s*(\w\w*)/i, //  := new
        /^:[^:]*?:([^:][^:]*)::/, // HotStr
        /^([^:][^:]*)::/, // HotKeys
        /^#(\w\w*)/, // directive
        /^global[\s,][\s,]*(\w[^:]*)/i, // global , ...
        /^throw[\s,][\s,]*(.+)/i, // throw
    ];

    private static readonly nameList: readonly string[] = [
        'Loop ',
        'For ',
        'Switch ',
        //--------------------------
        'Static ',
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

    // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
    private static readonly kindList: readonly vscode.SymbolKind[] = [
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        vscode.SymbolKind.Package,
        //--------------
        vscode.SymbolKind.Variable, // Static
        vscode.SymbolKind.Variable, // Case
        vscode.SymbolKind.Variable, // Default
        vscode.SymbolKind.Variable, // GoSub
        vscode.SymbolKind.Variable, // GoTo
        vscode.SymbolKind.Package, // Label
        vscode.SymbolKind.Object, //  Object
        vscode.SymbolKind.Event, // HotStr
        vscode.SymbolKind.Event, // HotKeys
        vscode.SymbolKind.Event, // directive
        vscode.SymbolKind.Variable, // Global
        vscode.SymbolKind.Event, // Throw
    ];

    private static readonly findBlockList: readonly boolean[] = [
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
    ];
}
