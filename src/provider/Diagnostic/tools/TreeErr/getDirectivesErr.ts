/* eslint-disable max-lines-per-function */
/* cSpell:disable */
import * as vscode from 'vscode';
import { CAhkDirectives } from '../../../../AhkSymbol/CAhkLine';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import type { THashTagUPKey } from '../../../../tools/Built-in/DirectivesList';
import { DirectivesUpKeyList } from '../../../../tools/Built-in/DirectivesList';
import { setDiagnostic } from '../setDiagnostic';

export function getDirectivesErr(ch: TAhkSymbol): vscode.Diagnostic[] {
    // err of #Directives
    if (!(ch instanceof CAhkDirectives)) return [];

    type TRulerErr = {
        str: THashTagUPKey;
        code: EDiagCode;
        severity: vscode.DiagnosticSeverity;
        tags: vscode.DiagnosticTag[];
    };

    const rulerMatch: TRulerErr[] = [
        {
            // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
            str: 'ESCAPECHAR',
            code: EDiagCode.code901,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
            str: 'COMMENTFLAG',
            code: EDiagCode.code902,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            /*
             * change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
             * #DerefChar
             */
            str: 'DEREFCHAR',
            code: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            /*
             * change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
             * #Delimiter
             */
            str: 'DELIMITER',
            code: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm
            str: 'ALLOWSAMELINECOMMENTS',
            code: EDiagCode.code825,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            /*
             * https://www.autohotkey.com/docs/commands/_Hotstring.htm
             * #Hotstring
             */
            str: 'HOTSTRING',
            code: EDiagCode.code904,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        },
    ];

    const { hashtag, selectionRange } = ch;
    for (const v of rulerMatch) {
        if (v.str === hashtag) {
            return [
                setDiagnostic(v.code, selectionRange, v.severity, v.tags),
            ];
        }
    }

    // check is unknown Directives or not
    return DirectivesUpKeyList.includes(hashtag as THashTagUPKey)
        ? []
        : [setDiagnostic(EDiagCode.code503, selectionRange, vscode.DiagnosticSeverity.Warning, [])];
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
