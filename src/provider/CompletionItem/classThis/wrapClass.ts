/* eslint-disable max-lines */
import * as vscode from 'vscode';
import {
    CAhkClass,
} from '../../../AhkSymbol/CAhkClass';
import { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { Detecter } from '../../../core/Detecter';
import { TTokenStream } from '../../../globalEnum';
import { getScopeOfPos } from '../../../tools/getScopeOfPos';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { ahkBaseUp, TAhkBaseObj } from '../ahkObj/ahkBase';
import { ahkBaseWrap } from '../ahkObj/ahkBaseWrap';
import { getUserDefTopClassSymbol } from './getUserDefTopClassSymbol';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';
import { RefClassWithName } from './RefClassWithName';

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
        ?? new vscode.Range(0, 0, position.line, position.character);

    const AhkTokenList: TTokenStream | undefined = Detecter.getDocMap(document.uri.fsPath)
        ?.DocStrMap.slice(
            stackRangeRaw.start.line,
            position.line + 1,
        );
    if (AhkTokenList === undefined) return [];
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

function triggerClassCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
): vscode.CompletionItem[] {
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
        const c0: CAhkClass | null = getUserDefTopClassSymbol(name.toUpperCase());
        if (c0 !== null) {
            const ahkThis: vscode.CompletionItem[] = ChapterArr.length === 1
                ? getWmThis(c0)
                : [];
            itemS.push(...ahkThis, ...parsingUserDefClassRecursive(c0, [fsPath], ChapterArr, 1));
        }
    }

    if (ChapterArr.length === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));
    return itemS;
}

function headIsThis(topSymbol: TTopSymbol | null, ChapterArr: readonly string[]): vscode.CompletionItem[] {
    return topSymbol instanceof CAhkClass
        ? [
            ...parsingUserDefClassRecursive(topSymbol, [topSymbol.uri.fsPath], ChapterArr, 1),
            ...getWmThis(topSymbol),
        ]
        : [];
}

function triggerClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
    topSymbol: TTopSymbol | null,
): vscode.CompletionItem[] {
    /*
    a common trigger character is . to trigger member completions.
    */

    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) return headIsThis(topSymbol, ChapterArr);

    const classSymbol: CAhkClass | null = getUserDefTopClassSymbol(Head.toUpperCase());
    if (classSymbol !== null) return RefClassWithName(ChapterArr, classSymbol);

    return triggerClassCore(document, position, ChapterArr);
}

export function wrapClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    topSymbol: TTopSymbol | null,
): vscode.CompletionItem[] {
    if (lStr.trim() === '') return [];

    const col = position.character;
    if (col > lStr.length) return [];

    const ChapterArr: readonly string[] | null = getObjChapterArr(textRaw, col);
    return ChapterArr === null
        ? []
        : triggerClass(document, position, ChapterArr, topSymbol);
}
