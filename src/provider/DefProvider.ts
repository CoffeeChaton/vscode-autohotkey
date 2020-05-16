/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeSpecialChar } from '../tools/removeSpecialChar';
import { inCommentBlock } from '../tools/inCommentBlock';
import { EMode } from '../tools/globalSet';

function ahkInclude(document: vscode.TextDocument, position: vscode.Position): vscode.Location | undefined {
    const includeExec = (/^#include(?:again)?\s*(?:\*i )?\s*(\S\S*\.(?:ahk|ext))$/i).exec(document.lineAt(position).text.trim()); // at #include line
    if (includeExec) {
        const length = Math.max(document.uri.path.lastIndexOf('/'), document.uri.path.lastIndexOf('\\'));
        if (length <= 0) return undefined;
        const parent = document.uri.path.substr(0, length);
        const fsPath = includeExec[1].replace(/%A_Space%/, ' ').replace(/%A_Tab%/, '\t');
        const fsPathFix = (/(%A_ScriptDir%)|(%A_WorkingDir%)|(%A_LineFile%)/).test(fsPath)
            ? includeExec[1].replace(/(%A_ScriptDir%)|(%A_WorkingDir%)|(%A_LineFile%)/, parent)
            : `${parent}\\${fsPath}`;
        const uri = vscode.Uri.file(fsPathFix);
        return new vscode.Location(uri, new vscode.Position(0, 0));
    }
    //   OK         #Include FileOrDirName
    //   TODO  #Include <LibName>
    //   OK         #IncludeAgain FileOrDirName
    //   OK       \*i\s
    // Will not support
    //              A_AhkPath, A_ComputerName, A_ComSpec, A_Desktop, A_DesktopCommon, A_IsCompiled
    //              A_MyDocuments, A_ProgramFiles, A_Programs, A_ProgramsCommon
    //              A_ScriptFullPath, A_ScriptName, A_StartMenu,A_StartMenuCommon
    //              A_Startup,A_StartupCommon, A_Temp, A_UserName ,A_WinDir
    //              A_UserName, A_WinDir
    // TODO https://www.autohotkey.com/docs/Functions.htm#lib
    return undefined;
}

export function tryGetSymbol(wordLower: string, mode: EMode): [Readonly<vscode.DocumentSymbol> | undefined, string] {
    for (const fsPath of Detecter.getCacheFileUri()) {
        const docSymbolList = Detecter.getDocDefQuick(fsPath, mode);
        if (docSymbolList === undefined) continue;
        const iMax = docSymbolList.length;
        for (let i = 0; i < iMax; i += 1) {
            if (docSymbolList[i].name.toLowerCase() === wordLower) return [docSymbolList[i], fsPath];
        }
    }
    return [undefined, ''];
}


// interface LimitDefCore {
//     getReference(usingReg: RegExp, timeStart: number, word: string): Promise<vscode.Location[]>;
//     ahkDef(document: vscode.TextDocument, position: vscode.Position, Mode: EMode, word: string,
//         DefReg: RegExp, usingReg: RegExp, timeStart: number): Promise<vscode.Location | vscode.Location[] | undefined>;
// }


async function getReference(usingReg: RegExp, timeStart: number, word: string): Promise<vscode.Location[]> {
    const List: vscode.Location[] = [];
    for (const fsPath of Detecter.getCacheFileUri()) {
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(fsPath);
        let CommentBlock = false;
        const lineCount = Math.min(document.lineCount, 10000);
        for (let line = 0; line < lineCount; line += 1) {
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            if (CommentBlock) continue;
            const textFix = removeSpecialChar(textRaw).trim();
            const textFixPos = textFix.search(usingReg);
            if (textFixPos > -1) {
                List.push(new vscode.Location(document.uri, new vscode.Position(line, textRaw.search(usingReg))));
            }
        }
    }
    //  vscode.window.showInformationMessage(`list all using of ${word} (${Date.now() - timeStart} ms)`);
    return List;
}

// eslint-disable-next-line max-params
async function ahkDef(document: vscode.TextDocument,
    position: vscode.Position,
    Mode: EMode,
    word: string,
    DefReg: RegExp,
    usingReg: RegExp,
    timeStart: number): Promise<vscode.Location | vscode.Location[] | undefined> {
    const textTrim = document.lineAt(position).text.trim().toLowerCase();
    const [AhkSymbol, fsPath] = tryGetSymbol(word, Mode);
    if (AhkSymbol === undefined) return undefined;

    const searchDef = (): Promise<vscode.Location[]> | undefined => {
        if (textTrim.search(DefReg) === -1) return undefined;
        if (fsPath === document.uri.fsPath
            && AhkSymbol.range.start.line === document.lineAt(position).lineNumber) {
            return getReference(usingReg, timeStart, word);
        }
        return undefined;
    };
    const searchUsing = (): vscode.Location | undefined => {
        if (textTrim.search(usingReg) === -1) return undefined;
        //      console.info(`goto Def of ${word} (${Date.now() - timeStart} ms)`);
        //  vscode.window.showInformationMessage(`goto Def of ${word} (${Date.now() - timeStart} ms)`);
        return new vscode.Location(vscode.Uri.file(fsPath), new vscode.Position(AhkSymbol.range.start.line, 0));
    };

    const Def = searchDef();
    if (Def !== undefined) return Def;

    const Using = searchUsing();
    if (Using !== undefined) return Using;

    return undefined;
}


async function userDef(document: vscode.TextDocument,
    position: vscode.Position, wordLower: string): Promise<vscode.Location | vscode.Location[] | undefined> {
    const timeStart = Date.now();
    const DefReg: readonly RegExp[] = [
        new RegExp(`^class\\b\\s\\s*\\b(${wordLower})\\b`, 'i'),
        // class ClassName
        new RegExp(`(?<!\\.)\\b(${wordLower})\\(`, 'i'),
        // funcName( , not search class.Method()
    ];

    const usingReg: readonly RegExp[] = [
        // eslint-disable-next-line max-len
        new RegExp(`(?:^class\\b\\s\\s*\\b(${wordLower})\\b)|(?:\\bnew\\s\\s*\\b(${wordLower})\\b)|(?:(${wordLower})\\.)|(?:\\bextends\\b\\s\\s*(${wordLower}))|(?:\\bglobal\\b\\s\\s*\\b(${wordLower})\\b)|(?:\\{\\s*base:\\s*(${wordLower}))|(?:\\w\\w*\\.base\\s*:=\\s*(${wordLower}))`, 'i'),
        // class ClassName | new className | className. | extends  className | global className |  {base: className | .base := baseObject
        new RegExp(`(?:(?<!\\.)\\b(${wordLower})\\()|(?:(?<=\\bfunc\\()["']\\b(${wordLower})\\b["'])`, 'i'),
        // funcName( | Func("funcName"
    ];
    // {
    //     const inClass = () => {
    //         const classMap = Detecter.getClassMap().get(document.uri) || [];
    //         const iMax = classMap.length;
    //         for (let i = 0; i < iMax; i += 1) {
    //             if (classMap[i].range.contains(position)) return classMap[i];
    //         }
    //         return undefined;
    //     };
    //     const userDefClass = inClass();
    //     if (userDefClass) {
    //         // FIXME
    //     }
    // }
    const Modes: readonly EMode[] = [
        EMode.ahkClass,
        EMode.ahkFunc,
    ];
    const iMax = Modes.length;
    for (let i = 0; i < iMax; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const Location = await ahkDef(
            document,
            position,
            Modes[i],
            wordLower,
            DefReg[i],
            usingReg[i],
            timeStart,
        );
        if (Location) return Location;
    }
    return undefined;
}


export class DefProvider implements vscode.DefinitionProvider {
    // Go to Definition (via F12 || Ctrl+Click)
    // open the definition to the side with ( via Ctrl+Alt+Click )
    // Peek Definition (via Alt+F12)
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | undefined> {
        const wordLower = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const fileLink = ahkInclude(document, position);
        if (fileLink) return fileLink;

        const userDefLink = await userDef(document, position, wordLower);
        if (userDefLink) return userDefLink;
        // TODO class.Method, this.classVar,GoSub, GoTo, ahk Built-in func
        return undefined;
    }
}
