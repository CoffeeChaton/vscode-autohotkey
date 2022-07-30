import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/Detecter';
import { Detecter } from '../../core/Detecter';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getValDefInFunc } from './getValDefInFunc';

type TFnFindCol = (lineStr: string) => IterableIterator<RegExpMatchArray>;

function getReference(refFn: TFnFindCol, timeStart: number, wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);

        if (AhkFileData === undefined) continue;
        const { DocStrMap, AhkSymbolList } = AhkFileData;

        const uri: vscode.Uri = vscode.Uri.file(fsPath);

        const filterLineList: number[] = getDAList(AhkSymbolList)
            .filter((DA: CAhkFunc) => DA.kind === vscode.SymbolKind.Method)
            .map((DA: CAhkFunc) => DA.nameRange.start.line);

        for (const { textRaw, line, lStr } of DocStrMap) {
            if (lStr.trim().length === 0 || filterLineList.includes(line)) continue;
            const text2: string = textRaw.slice(0, lStr.length);
            for (const ma of refFn(text2)) {
                const col: number | undefined = ma.index;
                if (col === undefined) continue;

                const Location: vscode.Location = new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, col),
                        new vscode.Position(line, col + wordUp.length),
                    ),
                );
                List.push(Location);
            }
        }
    }
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 9~11ms (if not gc)
    return List;
}

function isPosAtMethodName(DA: CAhkFunc | null, position: vscode.Position): boolean {
    return DA !== null
        && DA.kind === vscode.SymbolKind.Method
        && DA.nameRange.contains(position);
}

// FIXME: spilt this func, just need input ahkFunc
export function userDefFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const timeStart: number = Date.now();

    const AhkFileData: TAhkFileData = Detecter.getDocMap(document.uri.fsPath) ?? Detecter.updateDocDef(document);
    const { AhkSymbolList } = AhkFileData;

    if (isPosAtMethodName(getDAWithPos(AhkSymbolList, position), position)) {
        return null;
    }

    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUp);
    if (funcSymbol === null) return null;

    const ahkFunc = {
        // funcName( | "funcName"
        // eslint-disable-next-line security/detect-non-literal-regexp
        reg: new RegExp(`(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:(?<=")(${wordUp})")`, 'iug'),
        refFn: (lineStr: string): IterableIterator<RegExpMatchArray> => lineStr.matchAll(ahkFunc.reg),
    } as const;

    if (document.getWordRangeAtPosition(position, ahkFunc.reg) === undefined) return null;
    // c := c();
    // No   Yes check pos at like func()

    if (listAllUsing) return getReference(ahkFunc.refFn, timeStart, wordUp);

    if (
        (funcSymbol.uri.fsPath === document.uri.fsPath
            && funcSymbol.nameRange.contains(position))
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(document.uri, funcSymbol.nameRange)]; // let auto use getReference
    }

    console.log(`🚀 goto def of "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 0~1ms
    return [new vscode.Location(funcSymbol.uri, funcSymbol.selectionRange)];
}

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#])\b\w+\b/u);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    const listAllUsing = false;

    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
    if (userDefLink !== null) return userDefLink;

    const valInFunc: vscode.Location[] | null = getValDefInFunc(document, position, wordUp, listAllUsing);
    if (valInFunc !== null) return valInFunc;

    return null;
}

/*
 * Go to Definition (via F12 || Ctrl+Click)
 * open the definition to the side with ( via Ctrl+Alt+Click )
 * Peek Definition (via Alt+F12)
 */
export const DefProvider: vscode.DefinitionProvider = {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return DefProviderCore(document, position);
    },
};
