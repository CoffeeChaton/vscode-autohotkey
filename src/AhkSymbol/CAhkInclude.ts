import {
    isAbsolute,
    join,
    normalize,
    resolve,
} from 'node:path';
import * as vscode from 'vscode';
import type { TBaseLineParam } from './CAhkLine';

export const enum EInclude {
    A_LineFile = 0, // happy
    Absolute = 1, // happy
    Relative = 2, // bad
    // eslint-disable-next-line no-magic-numbers
    isUnknown = 3, // bad
    // eslint-disable-next-line no-magic-numbers
    Lib = 4, // bad
}

export type TRawData = {
    readonly type: EInclude;
    readonly mayPath: string;
    readonly warnMsg: string;
};

const list = [
    // 'A_LineFile',
    'A_WinDir',
    'A_UserName',
    'A_Temp',
    'A_StartupCommon',
    'A_Startup',
    'A_StartMenuCommon',
    'A_StartMenu', // keep sort line reverse
    'A_ScriptName',
    'A_ScriptFullPath',
    'A_ScriptDir', // WTF ? Changes the working directory for subsequent #Includes and FileInstalls. #Include %A_ScriptDir%
    'A_ProgramsCommon',
    'A_Programs', // keep sort line reverse
    'A_ProgramFiles',
    'A_MyDocuments',
    'A_IsCompiled',
    'A_DesktopCommon',
    'A_Desktop', // keep sort line reverse
    'A_ComSpec',
    'A_ComputerName',
    'A_AppDataCommon',
    'A_AppData',
    'A_AhkPath',
] as const;

function setWarnMsg(path1: string): string {
    const pathLow: string = path1.toLowerCase();
    const find: string | undefined = list.find((v: string): boolean => pathLow.includes(v.toLowerCase()));
    return find !== undefined
        ? `not yet support of "${find}"`
        : '';
}

function getRawData(path1: string, fsPath: string): TRawData {
    const warnMsg = setWarnMsg(path1);
    if ((/^%A_LineFile%/ui).test(path1)) {
        // [v1.1.11+]: Use %A_LineFile%\.. to refer to the directory which contains the current file
        //    , even if it is not the main script file. For example, #Include %A_LineFile%\..\other.ahk.
        return {
            type: EInclude.A_LineFile,
            mayPath: join(fsPath, `../${normalize(path1.replace(/^%A_LineFile%/ui, ''))}`),
            warnMsg,
        };
    }

    if (isAbsolute(path1)) {
        return {
            type: EInclude.Absolute,
            mayPath: path1,
            warnMsg,
        };
    }

    if (path1.startsWith('<') && path1.endsWith('>')) {
        return {
            type: EInclude.Lib,
            mayPath: path1.slice(1, -1),
            warnMsg,
        };
    }

    if (resolve(path1) === normalize(path1)) {
        return {
            type: EInclude.Relative,
            mayPath: normalize(path1),
            warnMsg,
        };
    }

    return {
        type: EInclude.isUnknown,
        mayPath: path1,
        warnMsg,
    };
}

export class CAhkInclude extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/commands/_Include.htm

    // #Include Compiler.ahk
    // #include *i __debug.ahk
    // #Include <VersionRes>
    // #Include %A_ScriptDir% ;Changes the working directory for subsequent #Includes and FileInstalls.
    // #Include %A_LineFile%\..\other.ahk.

    public readonly rawData: TRawData;

    public readonly IgnoreErrors: boolean;
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Module;
    declare public readonly detail: '';
    declare public readonly children: never[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
    ) {
        super(name, '', vscode.SymbolKind.Module, range, selectionRange);
        this.uri = uri;

        // RegExMatch(tLine, "i)^#Include(Again)?[ \t]*[, \t]\s*(.*)$", o)
        const path0: string = name.replace(/^\s*#include(Again)?\s/ui, '').trim();
        this.IgnoreErrors = (/^\*i\s/ui).test(path0); //  For example: #Include *i SpecialOptions.ahk
        const path1: string = path0.replace(/^\*i\s/ui, '').trim();
        this.rawData = getRawData(path1, uri.fsPath);
    }
}
