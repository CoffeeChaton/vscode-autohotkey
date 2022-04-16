import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { DeepReadonly, EMode, TSymAndFsPath } from '../../globalEnum';
import { tryGetSymbol } from '../../tools/tryGetSymbol';
import { getValWithDA } from './getValDefInFunc';

type TFnFindCol = (lineStr: string) => undefined | number;
type TDefObj = Readonly<{
    document: vscode.TextDocument;
    position: vscode.Position;
    Mode: EMode;
    wordUp: string;
    refFn: TFnFindCol;
    timeStart: number;
    listAllUsing: boolean;
}>;

function getReference(refFn: TFnFindCol, timeStart: number, wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);

        if (AhkFileData === undefined) continue;
        const uri: vscode.Uri = vscode.Uri.file(fsPath);
        for (const { textRaw, line, lStr } of AhkFileData.DocStrMap) {
            if (lStr.trim().length === 0) continue;
            const text2: string = textRaw.substring(0, lStr.length); // if toUpperCase can let 5~7ms -> 3~4ms...but i don't like it
            const col: number | undefined = refFn(text2);
            if (col !== undefined) {
                const Location: vscode.Location = new vscode.Location(
                    uri,
                    new vscode.Position(line, col),
                );
                List.push(Location);
            }
        }
    }
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 5~7ms (if not gc)
    return List;
}

function ahkDef(
    {
        document,
        position,
        Mode,
        wordUp,
        refFn,
        timeStart,
        listAllUsing,
    }: TDefObj,
): null | vscode.Location[] {
    const data: TSymAndFsPath | null = tryGetSymbol(wordUp, Mode);

    if (data === null) return null;
    const { AhkSymbol, fsPath } = data;

    if (listAllUsing) {
        return getReference(refFn, timeStart, wordUp);
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

export function userDefTopSymbol(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const timeStart: number = Date.now();
    type TRule = {
        refFn: TFnFindCol;
        Mode: EMode;
    };

    const ahkFunc = {
        // funcName( | "funcName"
        // eslint-disable-next-line security/detect-non-literal-regexp
        reg: new RegExp(`(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:"(${wordUp})")`, 'iu'),
        refFn: (lineStr: string): number | undefined => lineStr.match(ahkFunc.reg)?.index,
        Mode: EMode.ahkFunc,
    } as const;

    const matchList: DeepReadonly<TRule[]> = [ahkFunc];
    for (const { Mode, refFn } of matchList) {
        const Location: vscode.Location[] | null = ahkDef({
            document,
            position,
            Mode,
            wordUp,
            refFn,
            timeStart,
            listAllUsing,
        });
        if (Location !== null) return Location;
    }
    return null;
}

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): null | vscode.Location[] {
    //  Definition | DefinitionLink[]

    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();
    // const fileLink: vscode.Location | null = ahkInclude(document, position);
    // if (fileLink !== null) return fileLink;

    const listAllUsing = false;

    const userDefLink: vscode.Location[] | null = userDefTopSymbol(document, position, wordUp, listAllUsing);
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
