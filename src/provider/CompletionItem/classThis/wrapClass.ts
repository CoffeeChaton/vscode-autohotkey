/* eslint-disable max-lines */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EMode } from '../../../Enum/EMode';
import {
    TAhkSymbol,
    TAhkSymbolList,
    TSymAndFsPath,
    TTokenStream,
} from '../../../globalEnum';
import { getScopeOfPos, getStack } from '../../../tools/getScopeOfPos';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { kindCheck } from '../../Def/kindCheck';
import { ahkBaseUp, TAhkBaseObj } from '../ahkObj/ahkBase';
import { ahkBaseWrap } from '../ahkObj/ahkBaseWrap';
import { getWmThis } from './getWmThis';
import { insertTextWm } from './insertTextWm';

function getUserDefClassSymbol(keyUpName: string): TSymAndFsPath | null {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (
                kindCheck(EMode.ahkClass, AhkSymbol.kind)
                && keyUpName === AhkSymbol.name.toUpperCase()
            ) {
                return { AhkSymbol, fsPath };
            }
        }
    }
    return null;
}

function getKindOfCh(ch: TAhkSymbol): vscode.CompletionItemKind {
    switch (ch.kind) {
        case vscode.SymbolKind.Class:
            return vscode.CompletionItemKind.Class;
        case vscode.SymbolKind.Method:
            return vscode.CompletionItemKind.Method;
        case vscode.SymbolKind.Variable:
            return vscode.CompletionItemKind.Variable;
        default:
            return vscode.CompletionItemKind.User;
    }
}

async function wrapItem(
    fsPath: string,
    AhkSymbol: TAhkSymbol,
    track: string[],
): Promise<vscode.CompletionItem> {
    const item: vscode.CompletionItem = new vscode.CompletionItem(AhkSymbol.name.trim(), getKindOfCh(AhkSymbol));
    if (AhkSymbol.kind === vscode.SymbolKind.Method) {
        const methodName = await insertTextWm(fsPath, AhkSymbol); // FIXME: await
        item.label = methodName.value;
        item.insertText = methodName;
    }
    item.detail = 'neko help; (wrapClass)';
    const md = new vscode.MarkdownString('', true);
    // if (AhkSymbol.detail.trim()) {
    //     md.appendMarkdown('\n\ndetail: ')
    //         .appendMarkdown(AhkSymbol.detail.trim())
    //         .appendMarkdown('\n\n');
    // }
    md.appendMarkdown([...track].reverse().join('   \n'));
    item.documentation = md;
    return item;
}

function getKind(kind: vscode.SymbolKind): string {
    switch (kind) {
        case vscode.SymbolKind.Class:
            return 'Class';
        case vscode.SymbolKind.Function:
            return 'Function';
        case vscode.SymbolKind.Method:
            return 'Method';
        default:
            return 'Unknown';
    }
}

async function parsingUserDefClassRecursive(
    c0: TSymAndFsPath,
    track: readonly string[],
    ChapterArr: readonly string[],
    deep: number,
): Promise<vscode.CompletionItem[]> {
    const { fsPath, AhkSymbol } = c0;
    const fnStrEq = ChapterArr[deep]
        ? new RegExp(`^${ChapterArr[deep]}$`, 'iu')
        : /^$/u;
    const itemS: vscode.CompletionItem[] = [];
    const strKind = getKind(AhkSymbol.kind);
    const newTrack = [...track, `${strKind}  ${AhkSymbol.name}`];
    for (const ch of AhkSymbol.children) {
        const c1 = { AhkSymbol: ch, fsPath };
        if (ChapterArr.length === deep) itemS.push(await wrapItem(fsPath, ch, newTrack));
        if (ch.kind === vscode.SymbolKind.Class && fnStrEq.test(ch.name)) {
            itemS.push(...await parsingUserDefClassRecursive(c1, newTrack, ChapterArr, deep + 1)); // getCh
        }
    }

    if (AhkSymbol.kind === vscode.SymbolKind.Class) {
        const ahkExtends = AhkSymbol.detail;
        if (ahkExtends !== '') {
            const c1 = getUserDefClassSymbol(ahkExtends.toUpperCase());
            if (c1 && c1.AhkSymbol.kind === vscode.SymbolKind.Class) {
                itemS.push(...await parsingUserDefClassRecursive(c1, newTrack, ChapterArr, deep));
            }
        }
    }
    return itemS;
}

type TMathName = { ChapterArr: readonly string[]; strPart: string; ahkBaseObj: TAhkBaseObj };

function matchClassName({ ChapterArr, strPart, ahkBaseObj }: TMathName): string | null {
    // case 1: https://www.autohotkey.com/docs/Objects.htm#Objects_as_Functions
    if ((/^new\s/iu).test(strPart)) {
        const ahkNewClass = (/^\w+/u).exec(strPart.replace(/^new\s*/iu, ''));
        if (ahkNewClass !== null) return ahkNewClass[0];
    }
    // case 2:
    if (ChapterArr.length === 1) ahkBaseUp(strPart, ahkBaseObj);

    // case 3:

    // case ...
    return null;
}

function valTrack(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
    ahkBaseObj: TAhkBaseObj,
): string[] {
    const Head: string = ChapterArr[0];
    const stackRangeRaw = getScopeOfPos(document, position)
        || new vscode.Range(0, 0, position.line, position.character);

    const AhkTokenList: TTokenStream = Detecter.updateDocDef(document)
        .DocStrMap.slice(
            stackRangeRaw.start.line,
            position.line + 1,
        );
    const reg: RegExp = ahkValDefRegex(Head);

    const classNameList: string[] = []; // value name
    for (const { lStr } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) continue;
        const strPart: string = lStr.substring(col + Head.length, lStr.length).replace(/^\s*:=\s*/u, '');
        const name0: string | null = matchClassName({ ChapterArr, strPart, ahkBaseObj });
        if (name0 !== null) classNameList.push(name0);
    }

    return classNameList;
}

async function triggerClassCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
): Promise<vscode.CompletionItem[]> {
    const ahkBaseObj: TAhkBaseObj = {
        ahkArray: false,
        ahkFileOpen: false,
        ahkFuncObject: false,
        ahkBase: false,
    };
    const { fsPath } = document.uri;
    const itemS: vscode.CompletionItem[] = [];
    const nameList: string[] = valTrack(document, position, ChapterArr, ahkBaseObj);
    for (const name of nameList) {
        const c0: TSymAndFsPath | null = getUserDefClassSymbol(name.toUpperCase());
        if (c0 !== null) {
            const ahkThis: vscode.CompletionItem[] = ChapterArr.length === 1
                ? getWmThis(c0)
                : [];
            itemS.push(...ahkThis, ...await parsingUserDefClassRecursive(c0, [fsPath], ChapterArr, 1));
        }
    }

    if (ChapterArr.length === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));
    return itemS;
}

async function triggerClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
): Promise<vscode.CompletionItem[]> {
    /*
    a common trigger character is . to trigger member completions.
    */

    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) {
        const stackPro = getStack(document, position);
        return (stackPro === null || stackPro.stack.length === 0
                || stackPro.stack[0].AhkSymbol.kind !== vscode.SymbolKind.Class)
            ? []
            : getWmThis({ AhkSymbol: stackPro.stack[0].AhkSymbol, fsPath: document.uri.fsPath });
    }

    const c0: TSymAndFsPath | null = getUserDefClassSymbol(Head.toUpperCase()); // static class / val / Method
    if (c0 !== null) {
        const { fsPath } = document.uri;
        const ahkThis = ChapterArr.length === 1
            ? getWmThis(c0)
            : [];
        return [...await parsingUserDefClassRecursive(c0, [fsPath], ChapterArr, 1), ...ahkThis];
    }

    return triggerClassCore(document, position, ChapterArr);
}

export async function wrapClass(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<vscode.CompletionItem[]> {
    const ChapterArr: readonly string[] | null = getObjChapterArr(document, position);
    if (ChapterArr === null) return [];

    const ahkClassItem: vscode.CompletionItem[] = await triggerClass(document, position, ChapterArr);
    return ahkClassItem;
}

// WTF...
// FIXME: split this file
