/* eslint-disable security/detect-non-literal-regexp */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { MyDocSymbol, VERSION } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';

// is https://www.autohotkey.com/docs/Functions.htm#Local
function isForceLocalMode(docSymbol: MyDocSymbol, document: vscode.TextDocument): boolean {
    const newRange = new vscode.Range(docSymbol.selectionRange.end,
        new vscode.Position(docSymbol.selectionRange.end.line + 5, 0));

    const DocStrMap = Pretreatment(document.getText(newRange).split('\n'));
    for (let i = 0; i < DocStrMap.length; i++) {
        if ((/^\s*local\s*$/i).test(DocStrMap[i].lStr)) return true;
    }

    return false;
}

const enum EFuncPos {
    isFuncName = 1,
    isFuncArg = 2,
    isInLocal = 3,
    isNoLocal = 0,
}

function atFunPos(docSymbol: MyDocSymbol, document: vscode.TextDocument, position: vscode.Position): EFuncPos {
    if (docSymbol.selectionRange.contains(position)) return EFuncPos.isFuncArg;
    if (docSymbol.range.start.line === position.line) return EFuncPos.isFuncName;
    if (isForceLocalMode(docSymbol, document)) return EFuncPos.isInLocal;
    return EFuncPos.isNoLocal;
}

function searchValOfRange(document: vscode.TextDocument, searchRange: vscode.Range, regex: RegExp)
    : vscode.Location[] {
    const TextRawList = document.getText(searchRange).split('\n');
    const startLine = searchRange.start.line;
    const List: vscode.Location[] = [];
    for (let i = 0; i < TextRawList.length; i++) {
        const col = TextRawList[i].search(regex);
        if (col > -1) {
            const line = i + startLine;
            List.push(new vscode.Location(document.uri, new vscode.Position(line, col)));
        }
    }

    return List;
}

// TODO Continue Break to This Loop / For
// TODO  break outer
function searchClosestDef(document: vscode.TextDocument, searchRange: vscode.Range, regex: RegExp)
    : vscode.Location[] {
    const TextRawList = document.getText(searchRange).split('\n');
    const startLine = searchRange.start.line;
    for (let i = TextRawList.length; i > 0; i--) {
        const col = TextRawList[i].search(regex);
        if (col > -1) {
            const line = i + startLine;
            return [new vscode.Location(document.uri, new vscode.Position(line, col))];
        }
    }
    return [];
}
function wrapper(document: vscode.TextDocument, docSymbol: MyDocSymbol, wordLower: string, listAllUsing: boolean)
    : vscode.Location[] {
    const regex = new RegExp(`\\b${wordLower}\\b`, 'i');
    if (listAllUsing) {
        const debugStr = `list ${wordLower} all using,is ${VERSION.getValDefInFunc}`;
        console.log(debugStr);
        return searchValOfRange(document, docSymbol.range, regex);
    }

    const argDef = searchValOfRange(document, docSymbol.selectionRange, regex);
    if (argDef.length > 0) return argDef;

    const regList = [
        // TODO fix col of location
        new RegExp(`\\bstatic\\b[,\\s\\w]*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\blocal\\b[,\\s\\w]*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\bglobal\\b[,\\s\\w]*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\bVarSetCapacity\\b\\(${wordLower}\\b`, 'i'),
        new RegExp(`\\b${wordLower}\\b\\s*:=[^=]`, 'i'),
    ];

    for (const reg of regList) {
        const loc = searchValOfRange(document, docSymbol.range, reg);
        if (loc.length > 0) {
            const debugStr = `list ${wordLower} definition ,is ${VERSION.getValDefInFunc}`;
            console.log(debugStr);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            //     vscode.window.showInformationMessage(debugStr);
            return loc;
        }
    }
    return [];
}
export function getValDefInFunc(document: vscode.TextDocument, position: vscode.Position, wordLower: string, listAllUsing: boolean)
    : null | vscode.Location[] {
    const Range = document.getWordRangeAtPosition(position);
    if (Range === undefined) return null;

    const Uri = document.uri;
    const docSymbolList = Detecter.getDocMap(Uri.fsPath);
    if (docSymbolList === undefined) return null;

    for (const docSymbol of docSymbolList) {
        if (docSymbol.kind === vscode.SymbolKind.Function
            && docSymbol.range.contains(position)) {
            const funcPos = atFunPos(docSymbol, document, position);
            switch (funcPos) {
                case EFuncPos.isFuncArg: return wrapper(document, docSymbol, wordLower, true);
                case EFuncPos.isInLocal:
                case EFuncPos.isNoLocal:
                    return wrapper(document, docSymbol, wordLower, listAllUsing);
                case EFuncPos.isFuncName:
                    console.log('EFuncPos.isFuncName');
                    return null;
                default:
                    console.log('internal error -> enum error ->--getValDefInFunc--93--61--74--');
                    return null;
            }
        }
    }
    //   console.log('getValDefInFunc -> pos is not in Func Range');
    return null;
}
