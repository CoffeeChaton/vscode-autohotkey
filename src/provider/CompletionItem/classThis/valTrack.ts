import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { TTokenStream } from '../../../globalEnum';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { ahkBaseUp, TAhkBaseObj } from '../ahkObj/ahkBase';
import { ahkBaseWrap } from '../ahkObj/ahkBaseWrap';
import { getUserDefTopClassSymbol } from './getUserDefTopClassSymbol';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';

type TMathName = { ChapterArr: readonly string[]; strPart: string; ahkBaseObj: TAhkBaseObj };

function matchClassName({ ChapterArr, strPart, ahkBaseObj }: TMathName): string | null {
    // case 1: https://www.autohotkey.com/docs/Objects.htm#Objects_as_Functions
    const ahkNewClass: RegExpMatchArray | null = strPart.match(/^new\s*(\w+)/iu);
    if (ahkNewClass !== null) {
        return ahkNewClass[1];
    }

    // case 2:
    if (ChapterArr.length === 1) {
        ahkBaseUp(strPart, ahkBaseObj);
    }

    // case 3:
    // case ...
    return null;
}

function valTrackCore(
    ChapterArr: readonly string[],
    ahkBaseObj: TAhkBaseObj,
    AhkTokenList: TTokenStream,
): string[] {
    const Head: string = ChapterArr[0];

    const reg: RegExp = ahkValDefRegex(Head);

    const classNameList: string[] = []; // value name
    for (const { lStr } of AhkTokenList) {
        const col: number = lStr.search(reg);
        if (col === -1) continue;
        const strPart: string = lStr
            .slice(col + Head.length, lStr.length)
            .replace(/^\s*:=\s*/u, '');

        const name0: string | null = matchClassName({ ChapterArr, strPart, ahkBaseObj });
        if (name0 !== null) classNameList.push(name0);
    }

    return classNameList;
}

export function valTrack(ChapterArr: readonly string[], AhkTokenList: TTokenStream): vscode.CompletionItem[] {
    const ahkBaseObj: TAhkBaseObj = {
        ahkArray: false,
        ahkFileOpen: false,
        ahkFuncObject: false,
        ahkBase: false,
    };
    const itemS: vscode.CompletionItem[] = [];

    const nameList: string[] = valTrackCore(ChapterArr, ahkBaseObj, AhkTokenList);

    for (const name of nameList) {
        const c0: CAhkClass | null = getUserDefTopClassSymbol(name.toUpperCase());
        if (c0 === null) continue;

        const ahkThis: vscode.CompletionItem[] = ChapterArr.length === 1
            ? getWmThis(c0)
            : [];
        itemS.push(...ahkThis, ...parsingUserDefClassRecursive(c0, [c0.uri.fsPath], ChapterArr, 1));
    }

    // keep after const nameList, because ahkBaseObj modified of valTrackCore
    if (ChapterArr.length === 1) itemS.push(...ahkBaseWrap(ahkBaseObj));
    return itemS;
}
