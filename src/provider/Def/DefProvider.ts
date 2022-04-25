import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { EMode } from '../../Enum/EMode';
import { CAhkFuncSymbol, TSymAndFsPath } from '../../globalEnum';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { tryGetSymbol } from '../../tools/tryGetSymbol';
import { getValWithDA } from './getValDefInFunc';

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
            .filter((DA: CAhkFuncSymbol) => DA.kind === vscode.SymbolKind.Method)
            .map((DA: CAhkFuncSymbol) => DA.selectionRange.start.line);

        for (const { textRaw, line, lStr } of DocStrMap) {
            if (lStr.trim().length === 0 || filterLineList.indexOf(line) !== -1) continue;
            const text2: string = textRaw.substring(0, lStr.length);
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
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 9~11ms (if not gc)
    return List;
}

function isMethod(fsPath: string, position: vscode.Position): boolean {
    const DA: CAhkFuncSymbol | undefined = getDAWithPos(fsPath, position);
    return DA !== undefined
        && DA.kind === vscode.SymbolKind.Method
        && DA.selectionRange.contains(position);
}

export function userDefFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const timeStart: number = Date.now();

    const data: TSymAndFsPath | null = tryGetSymbol(wordUp, EMode.ahkFunc);
    if (data === null || isMethod(document.uri.fsPath, position)) return null;

    const { AhkSymbol, fsPath } = data;

    const ahkFunc = {
        // funcName( | "funcName"
        // eslint-disable-next-line security/detect-non-literal-regexp
        reg: new RegExp(`(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:(?<=")(${wordUp})")`, 'iug'),
        refFn: (lineStr: string): IterableIterator<RegExpMatchArray> => lineStr.matchAll(ahkFunc.reg),
    } as const;

    if (listAllUsing) {
        return getReference(ahkFunc.refFn, timeStart, wordUp);
    }

    if (
        (fsPath === document.uri.fsPath
            && AhkSymbol.selectionRange.start.line === position.line)
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(document.uri, AhkSymbol.selectionRange)]; // let auto use getReference
    }

    console.log(`🚀 goto def of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 0~1ms
    return [new vscode.Location(vscode.Uri.file(fsPath), AhkSymbol.selectionRange)];
}

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): null | vscode.Location[] {
    //  Definition | DefinitionLink[]

    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#])\b\w+\b/u);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();
    // const fileLink: vscode.Location | null = ahkInclude(document, position);
    // if (fileLink !== null) return fileLink;

    const listAllUsing = false;

    const userDefLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
    if (userDefLink !== null) return userDefLink;

    const valInFunc: vscode.Location[] | null = getValWithDA(document, position, wordUp, listAllUsing);
    if (valInFunc !== null) return valInFunc;

    return null;
}

// Go to Definition (via F12 || Ctrl+Click)
// open the definition to the side with ( via Ctrl+Alt+Click )
// Peek Definition (via Alt+F12)
export const DefProvider: vscode.DefinitionProvider = {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return DefProviderCore(document, position);
    },
};
