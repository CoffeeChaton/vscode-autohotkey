/* eslint-disable security/detect-non-literal-regexp */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { kindCheck } from '../Def/kindCheck';
import { EMode, MyDocSymbol, TSymAndFsPath } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';
import { ahkBase, CAhkBaseObj } from './ahkBase';
import { ahkBaseWrap } from './ahkBaseWrap';
import { getWmThis } from './getWmThis';
import { getScopeOfPos, getStack } from '../../tools/getScopeOfPos';
import { getObjChapterArr } from '../../tools/Obj/getObjChapterArr';

function getUserDefClassSymbol(testName: RegExp): TSymAndFsPath | null {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        for (const ahkSymbol of AhkSymbolList) {
            if (kindCheck(EMode.ahkClass, ahkSymbol.kind)
                && testName.test(ahkSymbol.name)) {
                return { ahkSymbol, fsPath };
            }
        }
    }
    return null;
}

function getKindOfCh(ch: MyDocSymbol): vscode.CompletionItemKind {
    switch (ch.kind) {
        case vscode.SymbolKind.Class: return vscode.CompletionItemKind.Class;
        case vscode.SymbolKind.Method: return vscode.CompletionItemKind.Method;
        case vscode.SymbolKind.Variable: return vscode.CompletionItemKind.Variable;
        default: return vscode.CompletionItemKind.User;
    }
}

function wrapItem(ch: MyDocSymbol, mdStr: string): vscode.CompletionItem {
    const item = new vscode.CompletionItem(ch.name.trim(), getKindOfCh(ch));
    if (ch.kind === vscode.SymbolKind.Method) {
        item.label = `${ch.name}()`; // TODO selectionText;
    }
    item.detail = 'neko help';
    item.documentation = new vscode.MarkdownString(`${ch.detail.trim()}    \n`, true).appendText(mdStr.trim());
    return item;
}

function wrapOfUserDefClass(userDefClass: MyDocSymbol, track: string, ChapterArr: string[], deep: number): vscode.CompletionItem[] {
    const fnStrEq = ChapterArr[deep] ? new RegExp(`^${ChapterArr[deep]}$`, 'i') : /^$/;
    const itemS: vscode.CompletionItem[] = [];
    const mdStr = `${userDefClass.name}    \n${track}`; // ${fsPath}    \nLn ${pos.line + 1} Col ${pos.character}`;
    userDefClass.children.forEach((ch) => {
        if (ChapterArr.length === deep) itemS.push(wrapItem(ch, mdStr));
        if (ch.kind === vscode.SymbolKind.Class && fnStrEq.test(ch.name)) {
            itemS.push(...wrapOfUserDefClass(ch, mdStr.trim(), ChapterArr, deep + 1)); // getCh
        }
    });

    const ahkExtends = userDefClass.detail;
    if (ahkExtends !== '') {
        const testName = new RegExp(`^${ahkExtends}$`, 'i');
        const tryGetAhkClass = getUserDefClassSymbol(testName);
        if (tryGetAhkClass && tryGetAhkClass.ahkSymbol.kind === vscode.SymbolKind.Class) {
            itemS.push(...wrapOfUserDefClass(tryGetAhkClass.ahkSymbol, mdStr, ChapterArr, deep));
        }
    }
    return itemS;
}

async function triggerClassTail(setUseDefClassNameStr: Set<string>, ChapterArrLen: number, ChapterArr: string[], ahkBaseObj: CAhkBaseObj)
    : Promise<vscode.CompletionItem[]> {
    const cList: Set<TSymAndFsPath> = new Set();
    setUseDefClassNameStr.forEach((v) => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        const testName = new RegExp(`^${v}$`, 'i');
        const c0 = getUserDefClassSymbol(testName);
        if (c0) cList.add(c0);
    });

    const itemS: vscode.CompletionItem[] = [];
    for (const c0 of cList) {
        // eslint-disable-next-line no-await-in-loop
        const ahkThis = ChapterArrLen === 1 ? await getWmThis(c0) : [];
        itemS.push(...ahkThis, ...wrapOfUserDefClass(c0.ahkSymbol, '', ChapterArr, 1));
    }

    if (ChapterArrLen === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));

    return itemS;
}

// eslint-disable-next-line max-statements
async function triggerClass(document: vscode.TextDocument, position: vscode.Position, ChapterArr: string[]): Promise<vscode.CompletionItem[]> {
    /*
    a common trigger character is . to trigger member completions.
    */

    const Head = ChapterArr[0];
    const ChapterArrLen = ChapterArr.length;
    if ((/^this$/i).test(Head)) {
        const stackPro = getStack(document, position);
        return (stackPro === null || stackPro.stack.length === 0 || stackPro.stack[0].ahkSymbol.kind !== vscode.SymbolKind.Class)
            ? []
            : getWmThis({ ahkSymbol: stackPro.stack[0].ahkSymbol, fsPath: document.uri.fsPath });
    }

    {
        const testName0 = new RegExp(`^${Head}$`, 'i');
        const c0 = getUserDefClassSymbol(testName0);
        if (c0) {
            const ahkThis = ChapterArrLen === 1 ? await getWmThis(c0) : [];
            return [...wrapOfUserDefClass(c0.ahkSymbol, '', ChapterArr, 1), ...ahkThis];
        }
    }

    const stackRange = getScopeOfPos(document, position) || new vscode.Range(0, 0, position.line, position.character);

    const reg = new RegExp(`\\b${Head}\\b\\s*:=`, 'i');
    const DocStrMap = Pretreatment(document.getText(stackRange).split('\n'));
    const lineStart = stackRange.start.line + 0;
    const linePosMax = DocStrMap.length;
    let ahkBaseObj: CAhkBaseObj = new CAhkBaseObj();
    const setUseDefClassNameStr: Set<string> = new Set(); // value name
    for (let linePos = 0; linePos < linePosMax; linePos++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const line = lineStart + linePos;
        const lStr = DocStrMap[linePos].lStr;
        const col = lStr.search(reg);
        if (col === -1) continue;
        const strPart = lStr.substring(col + Head.length, lStr.length).replace(/^\s*:=\s*/, ''); // TODO

        if ((/^new\s/i).test(strPart)) {
            // https://www.autohotkey.com/docs/Objects.htm#Objects_as_Functions
            const ahkNewClass = (/^\w\w+/).exec(strPart.replace(/^new\s*/i, ''));
            if (ahkNewClass !== null) {
                setUseDefClassNameStr.add(ahkNewClass[0]);
                continue;
            }
        }
        if (ChapterArrLen === 1) {
            ahkBaseObj = ahkBase(strPart, ahkBaseObj);
        }
    }

    return triggerClassTail(setUseDefClassNameStr, ChapterArrLen, ChapterArr, ahkBaseObj);
}

export async function wrapClass(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
    const ChapterArr = getObjChapterArr(document, position); // TODO [].
    if (ChapterArr === null) return [];

    const ahkClassItem = await triggerClass(document, position, ChapterArr);
    return ahkClassItem;
}
