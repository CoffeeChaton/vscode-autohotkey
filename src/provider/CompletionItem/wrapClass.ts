/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-regexp */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { kindCheck } from '../Def/kindCheck';
import { EMode, MyDocSymbol, TSymAndFsPath } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';
import { ahkBase, CAhkBaseObjBoom } from './ahkBase';
import { ahkBaseWrap } from './ahkBaseWrap';
import { getWmThis } from './getWmThis';
import { getScopeOfPos, getStack } from '../../tools/getScopeOfPos';
import { getObjChapterArr } from '../../tools/Obj/getObjChapterArr';
import { insertTextWm } from './insertTextWm';

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

async function wrapItem(ch: MyDocSymbol, track: string[], fsPath: string): Promise<vscode.CompletionItem> {
    const item = new vscode.CompletionItem(ch.name.trim(), getKindOfCh(ch));
    if (ch.kind === vscode.SymbolKind.Method) {
        const methodName = await insertTextWm(ch, fsPath);
        item.label = methodName.value;
        item.insertText = methodName;
    }
    item.detail = 'neko help';
    const mdStr = track.join('   \n');
    const md = new vscode.MarkdownString(mdStr, true);
    if (ch.detail.trim()) {
        md.appendMarkdown('\n\ndetail: ').appendMarkdown(ch.detail.trim());
    }

    item.documentation = md;
    return item;
}

function getKind(kind: vscode.SymbolKind): string {
    switch (kind) {
        case vscode.SymbolKind.Class: return 'Class';
        case vscode.SymbolKind.Function: return 'Function';
        case vscode.SymbolKind.Method: return 'Method';
        default: return 'Unknown';
    }
}
async function parsingUserDefClassRecursive(userDefClass: MyDocSymbol,
    track: readonly string[], ChapterArr: readonly string[], deep: number, fsPath: string)
    : Promise<vscode.CompletionItem[]> {
    const fnStrEq = ChapterArr[deep] ? new RegExp(`^${ChapterArr[deep]}$`, 'i') : /^$/;
    const itemS: vscode.CompletionItem[] = [];
    const strKind = getKind(userDefClass.kind);
    const newTrack = [...track, `${strKind}  ${userDefClass.name}`];
    for (const ch of userDefClass.children) {
        if (ChapterArr.length === deep) itemS.push(await wrapItem(ch, newTrack, fsPath));
        if (ch.kind === vscode.SymbolKind.Class && fnStrEq.test(ch.name)) {
            itemS.push(...await parsingUserDefClassRecursive(ch, newTrack, ChapterArr, deep + 1, fsPath)); // getCh
        }
    }

    if (userDefClass.kind === vscode.SymbolKind.Class) {
        const ahkExtends = userDefClass.detail;
        if (ahkExtends !== '') {
            const testName = new RegExp(`^${ahkExtends}$`, 'i');
            const c0 = getUserDefClassSymbol(testName);
            if (c0 && c0.ahkSymbol.kind === vscode.SymbolKind.Class) {
                itemS.push(...await parsingUserDefClassRecursive(c0.ahkSymbol, newTrack, ChapterArr, deep, fsPath));
            }
        }
    }
    return itemS;
}

type TMathName = { ChapterArr: readonly string[]; strPart: string; ahkBaseObj: CAhkBaseObjBoom };

function matchClassName({ ChapterArr, strPart, ahkBaseObj }: TMathName): string | null {
    // case 1: https://www.autohotkey.com/docs/Objects.htm#Objects_as_Functions
    if ((/^new\s/i).test(strPart)) {
        const ahkNewClass = (/^\w\w+/).exec(strPart.replace(/^new\s*/i, ''));
        if (ahkNewClass !== null) return ahkNewClass[0];
    }
    // case 2:
    if (ChapterArr.length === 1) ahkBase(strPart, ahkBaseObj);

    // case 3:

    // case ...
    return null;
}
function valTrack(document: vscode.TextDocument, position: vscode.Position, ChapterArr: readonly string[], ahkBaseObj: CAhkBaseObjBoom): string[] {
    const Head = ChapterArr[0];
    const stackRangeRaw = getScopeOfPos(document, position) || new vscode.Range(0, 0, position.line, position.character);
    const stackRange = new vscode.Range(stackRangeRaw.start.line, stackRangeRaw.start.character, position.line, position.character);

    const reg = new RegExp(`\\b${Head}\\b\\s*:=`, 'i');
    const DocStrMap = Pretreatment(document.getText(stackRange).split('\n'));
    const lineStart = stackRange.start.line + 0;
    const linePosMax = DocStrMap.length;
    const classNameList: string[] = []; // value name
    for (let linePos = 0; linePos < linePosMax; linePos++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const line = lineStart + linePos;
        const lStr = DocStrMap[linePos].lStr;
        const col = lStr.search(reg);
        if (col === -1) continue;
        const strPart = lStr.substring(col + Head.length, lStr.length).replace(/^\s*:=\s*/, ''); // TODO
        const name0 = matchClassName({ ChapterArr, strPart, ahkBaseObj });
        if (name0) classNameList.push(name0);
    }
    return classNameList;
}

async function triggerClassCore(document: vscode.TextDocument, position: vscode.Position, ChapterArr: readonly string[])
    : Promise<vscode.CompletionItem[]> {
    const ahkBaseObj: CAhkBaseObjBoom = new CAhkBaseObjBoom();
    const fsPath = document.uri.fsPath;
    const itemS: vscode.CompletionItem[] = [];
    const nameList = valTrack(document, position, ChapterArr, ahkBaseObj);
    for (const name of nameList) {
        const testName = new RegExp(`^${name}$`, 'i');
        const c0 = getUserDefClassSymbol(testName);
        if (c0) {
            const ahkThis = ChapterArr.length === 1 ? await getWmThis(c0) : [];
            itemS.push(...ahkThis, ...await parsingUserDefClassRecursive(c0.ahkSymbol, [fsPath], ChapterArr, 1, fsPath));
        }
    }

    if (ChapterArr.length === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));
    return itemS;
}

async function triggerClass(document: vscode.TextDocument, position: vscode.Position, ChapterArr: readonly string[])
    : Promise<vscode.CompletionItem[]> {
    /*
    a common trigger character is . to trigger member completions.
    */

    const Head = ChapterArr[0];
    if ((/^this$/i).test(Head)) {
        const stackPro = getStack(document, position);
        return (stackPro === null || stackPro.stack.length === 0 || stackPro.stack[0].ahkSymbol.kind !== vscode.SymbolKind.Class)
            ? []
            : getWmThis({ ahkSymbol: stackPro.stack[0].ahkSymbol, fsPath: document.uri.fsPath });
    }

    const testName0 = new RegExp(`^${Head}$`, 'i');
    const c0 = getUserDefClassSymbol(testName0);
    if (c0) {
        const fsPath = document.uri.fsPath;
        const ahkThis = ChapterArr.length === 1 ? await getWmThis(c0) : [];
        return [...await parsingUserDefClassRecursive(c0.ahkSymbol, [fsPath], ChapterArr, 1, fsPath), ...ahkThis];
    }

    return triggerClassCore(document, position, ChapterArr);
}

export async function wrapClass(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
    const ChapterArr = getObjChapterArr(document, position); // TODO [].
    if (ChapterArr === null) return [];

    const ahkClassItem = await triggerClass(document, position, ChapterArr);
    return ahkClassItem;
}
