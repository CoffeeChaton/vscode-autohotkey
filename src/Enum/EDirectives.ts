/* cSpell:disable */

export const DirectivesList = [
    'ALLOWSAMELINECOMMENTS',
    'CLIPBOARDTIMEOUT',
    'COMMENTFLAG',
    'DELIMITER',
    'DEREFCHAR',
    'ERRORSTDOUT',
    'ESCAPECHAR',
    'HOTKEYINTERVAL',
    'HOTKEYMODIFIERTIMEOUT',
    'HOTSTRING',
    'IF',
    'IFTIMEOUT',
    'IFWINACTIVE',
    'IFWINEXIST',
    'IFWINNOTACTIVE',
    'IFWINNOTEXIST',
    'INPUTLEVEL',
    'INSTALLKEYBDHOOK',
    'INSTALLMOUSEHOOK',
    'KEYHISTORY',
    'LTRIM',
    'MAXHOTKEYSPERINTERVAL',
    'MAXMEM',
    'MAXTHREADS',
    'MAXTHREADSBUFFER',
    'MAXTHREADSPERHOTKEY',
    'MENUMASKKEY',
    'NOENV',
    'NOTRAYICON',
    'PERSISTENT',
    'REQUIRES',
    'SINGLEINSTANCE',
    'USEHOOK',
    'WARN',
    'WINACTIVATEFORCE',
    // 'INCLUDE',
    // 'INCLUDEAGAIN',
] as const;

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
