/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-console */
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
    isLocal = 3,
    isNotLocal = 0,
}

function atFunPos(docSymbol: MyDocSymbol, document: vscode.TextDocument, position: vscode.Position): EFuncPos {
    if (docSymbol.selectionRange.contains(position)) return EFuncPos.isFuncArg;
    if (docSymbol.range.start.line === position.line) return EFuncPos.isFuncName;
    if (isForceLocalMode(docSymbol, document)) return EFuncPos.isLocal;
    return EFuncPos.isNotLocal;
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        vscode.window.showInformationMessage(`list ${wordLower} all using,is ${VERSION.getValDefInFunc}`);
        return searchValOfRange(document, docSymbol.range, regex);
    }

    const argDef = searchValOfRange(document, docSymbol.selectionRange, regex);

    // local varName
    const localRegex = new RegExp(`\\blocal\\b\\s\\s*\\b${wordLower}\\b`, 'i');
    const localDeclarations = searchValOfRange(document, docSymbol.range, localRegex);

    // global varName
    const globalRegex = new RegExp(`\\bglobal\\b[,\\s\\w]*\\b${wordLower}\\b`, 'i');
    const globalDeclarations = searchValOfRange(document, docSymbol.range, globalRegex);

    // StoringVal := or =
    const storingValRegex = new RegExp(`\\b${wordLower}\\b\\s*[^=]=[^=]`, 'i');
    const storingVal = searchValOfRange(document, docSymbol.range, storingValRegex);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    vscode.window.showInformationMessage(`list ${wordLower} definition ,is ${VERSION.getValDefInFunc}`);
    const locArray = argDef.concat(localDeclarations).concat(globalDeclarations).concat(storingVal);
    return locArray;
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
            const switchVal = atFunPos(docSymbol, document, position);
            switch (switchVal) {
                case EFuncPos.isFuncArg: return wrapper(document, docSymbol, wordLower, true);
                case EFuncPos.isLocal: return wrapper(document, docSymbol, wordLower, listAllUsing);
                case EFuncPos.isNotLocal:
                    vscode.window.showInformationMessage('this Val is not in "local" mode function (Force-local mode)');
                    vscode.window.showInformationMessage('https://www.autohotkey.com/docs/Functions.htm#ForceLocal');
                    return null;
                case EFuncPos.isFuncName:
                    console.log('EFuncPos.isFuncName');
                    return null;
                default:
                    vscode.window.showInformationMessage('enum err --getValDefInFunc--93--61--74--');
                    return null;
            }
        }
    }
    //   console.log('getValDefInFunc -> pos is not in Func Range');
    return null;
}
