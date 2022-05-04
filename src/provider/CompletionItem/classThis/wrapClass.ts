/* eslint-disable max-lines */
/* eslint-disable security/detect-non-literal-regexp */
import * as vscode from 'vscode';
import { CAhkClass } from '../../../CAhkClass';
import { CAhkFunc } from '../../../CAhkFunc';
import { Detecter } from '../../../core/Detecter';
import { TTokenStream } from '../../../globalEnum';
import { TAhkSymbol, TAhkSymbolList } from '../../../TAhkSymbolIn';
import { getScopeOfPos, getStack } from '../../../tools/getScopeOfPos';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { ahkValDefRegex } from '../../../tools/regexTools';
import { ahkBaseUp, TAhkBaseObj } from '../ahkObj/ahkBase';
import { ahkBaseWrap } from '../ahkObj/ahkBaseWrap';
import { getWmThis } from './getWmThis';

function getUserDefTopClassSymbol(keyUpName: string): CAhkClass | null {
    const fsPaths = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (
                AhkSymbol instanceof CAhkClass
                && keyUpName === AhkSymbol.name.toUpperCase()
            ) {
                return AhkSymbol;
            }
        }
    }
    return null;
}

function getKindOfCh(kind: vscode.SymbolKind): vscode.CompletionItemKind {
    // dprint-ignore
    switch (kind) {
        case vscode.SymbolKind.Class: return vscode.CompletionItemKind.Class;
        case vscode.SymbolKind.Method: return vscode.CompletionItemKind.Method;
        case vscode.SymbolKind.Variable: return vscode.CompletionItemKind.Variable;
        default: return vscode.CompletionItemKind.User;
    }
}

function wrapItem(AhkSymbol: TAhkSymbol, track: string[]): vscode.CompletionItem {
    const item: vscode.CompletionItem = new vscode.CompletionItem(AhkSymbol.name.trim(), getKindOfCh(AhkSymbol.kind));
    if (
        AhkSymbol instanceof CAhkFunc
        && AhkSymbol.kind === vscode.SymbolKind.Method
    ) {
        item.label = AhkSymbol.selectionRangeText;
        item.insertText = AhkSymbol.selectionRangeText;

        item.detail = 'neko help; (wrapClass)';
        item.documentation = AhkSymbol.md;
        return item;
    }
    item.detail = 'neko help; (wrapClass)';
    const md = new vscode.MarkdownString('', true);
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

function parsingUserDefClassRecursive(
    AhkSymbol: TAhkSymbol,
    track: readonly string[],
    ChapterArr: readonly string[],
    deep: number,
): vscode.CompletionItem[] {
    const fnStrEq = new RegExp(`^${ChapterArr[deep]}$`, 'iu');

    const itemS: vscode.CompletionItem[] = [];
    const strKind = getKind(AhkSymbol.kind);
    const newTrack = [...track, `${strKind}  ${AhkSymbol.name}`];
    for (const ch of AhkSymbol.children) {
        if (ChapterArr.length === deep) itemS.push(wrapItem(ch, newTrack));
        if (ch.kind === vscode.SymbolKind.Class && fnStrEq.test(ch.name)) {
            itemS.push(...parsingUserDefClassRecursive(ch, newTrack, ChapterArr, deep + 1)); // getCh
        }
    }

    if (AhkSymbol.kind === vscode.SymbolKind.Class) {
        const ahkExtends = AhkSymbol.detail;
        if (ahkExtends !== '') {
            const c1 = getUserDefTopClassSymbol(ahkExtends.toUpperCase());
            if (c1 !== null) {
                itemS.push(...parsingUserDefClassRecursive(c1, newTrack, ChapterArr, deep));
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

function triggerClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    ChapterArr: readonly string[],
): vscode.CompletionItem[] {
    /*
    a common trigger character is . to trigger member completions.
    */

    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) {
        const stackPro = getStack(document, position);
        if (
            stackPro === null
            || stackPro.stack.length === 0
        ) {
            return [];
        }
        const headClass = stackPro.stack[0].AhkSymbol;

        return !(headClass instanceof CAhkClass)
            ? []
            : getWmThis(headClass);
    }

    const c0: CAhkClass | null = getUserDefTopClassSymbol(Head.toUpperCase()); // static class / val / Method
    if (c0 !== null) {
        const { fsPath } = document.uri;
        const ahkThis = ChapterArr.length === 1
            ? getWmThis(c0)
            : [];
        return [...parsingUserDefClassRecursive(c0, [fsPath], ChapterArr, 1), ...ahkThis];
    }

    return triggerClassCore(document, position, ChapterArr);
}

export function wrapClass(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const ChapterArr: readonly string[] | null = getObjChapterArr(document, position);
    if (ChapterArr === null) return [];

    const ahkClassItem: vscode.CompletionItem[] = triggerClass(document, position, ChapterArr);
    return ahkClassItem;
}

// FIXME: split this WTF file
