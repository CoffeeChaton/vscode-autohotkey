/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { CAhkDirectives } from '../../../../AhkSymbol/CAhkLine';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import type { TTokenStream } from '../../../../globalEnum';
import type { THashTagUPKey } from '../../../../tools/Built-in/Directives';
import { DirectivesMDMap } from '../../../../tools/Built-in/Directives';
import { CDiagBase } from '../CDiagBase';

type TDiagMsg = {
    value: EDiagCode;
    severity: vscode.DiagnosticSeverity;
    tags: vscode.DiagnosticTag[];
};

const DiagDirectivesMap: ReadonlyMap<string, TDiagMsg> = ((): ReadonlyMap<string, TDiagMsg> => {
    type TRulerErr = {
        str: THashTagUPKey;
        value: EDiagCode;
        severity: vscode.DiagnosticSeverity;
        tags: vscode.DiagnosticTag[];
    };
    const arr: TRulerErr[] = [
        {
            // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
            str: 'ESCAPECHAR',
            value: EDiagCode.code901,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
            str: 'COMMENTFLAG',
            value: EDiagCode.code902,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            /*
             * change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
             * #DerefChar
             */
            str: 'DEREFCHAR',
            value: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            /*
             * change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
             * #Delimiter
             */
            str: 'DELIMITER',
            value: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm
            str: 'ALLOWSAMELINECOMMENTS',
            value: EDiagCode.code825,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
    ];

    const map = new Map<string, TDiagMsg>();
    for (
        const {
            str,
            value,
            severity,
            tags,
        } of arr
    ) {
        map.set(str, { value, severity, tags });
    }

    return map;
})();

/**
 * ```ahk
 * #Hotstring EndChars
 * ;            ^ No support
 * ```
 *
 * [read more](https://www.autohotkey.com/docs/commands/_Hotstring.htm)
 */
function HotstringEndChars(ch: CAhkDirectives, DocStrMap: TTokenStream): CDiagBase[] {
    const { selectionRange } = ch;
    const { lStr } = DocStrMap[selectionRange.start.line];

    if (!(/^\s*#Hotstring\b[ \t]+\bEndChars\b[ \t]/ui).test(lStr)) {
        return [];
    }
    // OK --> #Hotstring NoMouse
    // NG --> #Hotstring EndChars NewChars
    // OK --> #Hotstring NewOptions

    // did i need flag support of NewOptions
    // https://www.autohotkey.com/docs/Hotstrings.htm#Options

    return [
        new CDiagBase({
            value: EDiagCode.code904,
            range: selectionRange,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        }),
    ];
}

export function getDirectivesErr(ch: TAhkSymbol, DocStrMap: TTokenStream): CDiagBase[] {
    // err of #Directives
    if (!(ch instanceof CAhkDirectives)) return [];

    const { hashtag, selectionRange } = ch;
    const v: TDiagMsg | undefined = DiagDirectivesMap.get(hashtag);
    if (v !== undefined) {
        const { value, severity, tags } = v;
        return [
            new CDiagBase({
                value,
                range: selectionRange,
                severity,
                tags,
            }),
        ];
    }

    if (hashtag === 'HOTSTRING') {
        return HotstringEndChars(ch, DocStrMap);
    }

    // check is unknown Directives or not
    return DirectivesMDMap.has(hashtag)
        ? []
        : [
            new CDiagBase({
                value: EDiagCode.code603,
                range: selectionRange,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [],
            }),
        ];
}

/*
#DerefChar
#AllowSameLineComments
#ClipboardTimeout Milliseconds
#CommentFlag NewString
#EscapeChar NewChar
#DerefChar #  ; Change it from its normal default, which is %.
#Delimiter /  ; Change it from its normal default, which is comma.
#ErrorStdOut Encoding
#EscapeChar NewChar
#HotkeyInterval Milliseconds
#HotkeyModifierTimeout Milliseconds
#Hotstring NoMouse
#Hotstring EndChars NewChars
#Hotstring NewOptions
#If Expression
#IfTimeout Timeout
#IfWinActive WinTitle, WinText
#IfWinExist WinTitle, WinText
#IfWinNotActive WinTitle, WinText
#IfWinNotExist WinTitle, WinText
#If , Expression

#Include FileOrDirName
#Include <LibName>
#IncludeAgain FileOrDirName
#InputLevel Level
#InstallKeybdHook
#InstallMouseHook
#KeyHistory MaxEvents
#LTrim Off
#MaxHotkeysPerInterval Value
#MaxMem Megabytes
#MaxThreads Value
#MaxThreadsBuffer OnOff
#MaxThreadsPerHotkey Value
#MenuMaskKey KeyName
#NoEnv
#NoTrayIcon
#Persistent
#Requires Requirement
#SingleInstance ForceIgnorePromptOff
#UseHook OnOff
#Warn WarningType, WarningMode
#WinActivateForce

Unknown #Directives
#WT ; Unknown #Directives
*/
