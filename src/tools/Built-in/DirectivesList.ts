/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable max-len */
/* cSpell:disable */
import * as vscode from 'vscode';
import { DeepReadonly } from '../../globalEnum';

export const DirectivesUpKeyList = [
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

export type THashTagUPKey = typeof DirectivesUpKeyList[number];

type TElement = DeepReadonly<{
    keyRawName: string;
    insert: string;
    doc: string;

    recommended: boolean;
    link: string;
    exp: string[];
}>;

type TDirectivesObj = {
    [k in THashTagUPKey]: TElement;
};

const DirectivesList: TDirectivesObj = {
    ALLOWSAMELINECOMMENTS: {
        keyRawName: '#AllowSameLineComments',
        insert: '#AllowSameLineComments',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm',
        exp: [
            '#AllowSameLineComments',
            ';[v1.1.09+]: This directive was removed. AutoIt scripts are no longer supported.',
        ],
    },
    CLIPBOARDTIMEOUT: {
        keyRawName: '#ClipboardTimeout',
        insert: '#ClipboardTimeout, ${1:Milliseconds}',
        doc: 'Changes how long the script keeps trying to access the clipboard when the first attempt fails.',

        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_ClipboardTimeout.htm',
        exp: [
            '#ClipboardTimeout Milliseconds',
            ';Milliseconds as ms',
            ';  The length of the interval in milliseconds.',
            ';  Specify -1 to have it keep trying indefinitely.',
            ';  Specify 0 to have it try only once.',
            ';  Scripts that do not contain this directive use a 1000 ms timeout.',
        ],
    },
    COMMENTFLAG: {
        keyRawName: '#CommentFlag',
        insert: '#CommentFlag ${1:NewString}',
        doc: 'Deprecated: This directive is not recommended for use in new scripts. Use the default comment flag (semicolon) instead.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_CommentFlag.htm',
        exp: [
            '#CommentFlag NewString',
            '; Deprecated: This directive is not recommended for use in new scripts. Use the default comment flag (semicolon) instead.',
            '; DO NOT USE THIS DIRECTIVES',
            '; ahk-neko-help is not supported this',
        ],
    },
    DELIMITER: {
        keyRawName: '#Delimiter',
        insert: '#Delimiter ${1:NewString}',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Delimiter',
        exp: [
            '#Delimiter NewString',
            '; Deprecated: These directives are not recommended for use in new scripts.',
            '; DO NOT USE THIS DIRECTIVES',
            '; ahk-neko-help is not supported this',
        ],
    },
    DEREFCHAR: {
        keyRawName: '#DerefChar',
        insert: '#DerefChar ${1:NewString}',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#DerefChar',
        exp: [
            '#DerefChar NewString',
            '; Deprecated: These directives are not recommended for use in new scripts.',
            '; DO NOT USE THIS DIRECTIVES',
            '; ahk-neko-help is not supported this',
        ],
    },
    ERRORSTDOUT: {
        keyRawName: '#ErrorStdOut',
        insert: '#ErrorStdOut',
        doc: 'Sends any syntax error that prevents a script from launching to stderr rather than displaying a dialog.',

        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_ErrorStdOut.htm',
        exp: [
            '#ErrorStdOut Encoding',
            '; Encoding as String',
            ';    An encoding string specifying how to encode the output.',
            '#ErrorStdOut UTF-8 ; encodes error messages as UTF-8 before sending them to stderr.',
            '#ErrorStdOut ; as CP0',
        ],
    },
    ESCAPECHAR: {
        keyRawName: '#EscapeChar',
        insert: '#EscapeChar ${1:NewChar}',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',

        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm',
        exp: [
            '#EscapeChar NewChar',
            '; Deprecated: These directives are not recommended for use in new scripts.',
            '; DO NOT USE THIS DIRECTIVES',
            '; ahk-neko-help is not supported this',
        ],
    },
    HOTKEYINTERVAL: {
        keyRawName: '#HotkeyInterval',
        insert: '#HotkeyInterval, ${1:Milliseconds}',
        doc: 'Along with [#MaxHotkeysPerInterval](https://www.autohotkey.com/docs/commands/_MaxHotkeysPerInterval.htm), specifies the rate of [hotkey](https://www.autohotkey.com/docs/Hotkeys.htm) activations beyond which a warning dialog will be displayed.',

        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_HotkeyInterval.htm',
        exp: [
            '#HotkeyInterval Milliseconds',
            '; Milliseconds as ms',
            ';   The length of the interval in milliseconds.',
            '',
            '; exp',
            '#HotkeyInterval 2000  ; This is the default value (milliseconds)',
            '#MaxHotkeysPerInterval 200',
        ],
    },
    HOTKEYMODIFIERTIMEOUT: {
        keyRawName: '#HotkeyModifierTimeout',
        insert: '#HotkeyModifierTimeout, ${1:Milliseconds}',
        doc: 'Affects the behavior of [hotkey](https://www.autohotkey.com/docs/Hotkeys.htm) modifiers: `Ctrl`, `Alt`, `Win`, and `Shift`.',

        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_HotkeyModifierTimeout.htm',
        exp: [
            '#HotkeyModifierTimeout Milliseconds',
            '; Milliseconds as ms',
            ';   -1 -> never times out (modifier keys are always pushed back down after the Send)',
            ';    0 -> always times out (modifier keys are never pushed back down)',
            ';   default as 50 ms',
            '',
            '; exp',
            '#HotkeyModifierTimeout 100',
        ],
    },
    HOTSTRING: {
        keyRawName: '#Hotstring',
        insert: '#Hotstring, ${1:NewOptions}',
        doc: 'Changes hotstring options or ending characters.',

        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/_Hotstring.htm',
        exp: [
            '#Hotstring NoMouse',
            '#Hotstring EndChars NewChars',
            '#Hotstring NewOptions',
            '; not recommended to use',
        ],
    },
    IF: {
        keyRawName: '#If',
        insert: '#If, $0',
        doc: 'Creates context-sensitive [hotkeys](https://www.autohotkey.com/docs/Hotkeys.htm) and [hotstrings](https://www.autohotkey.com/docs/Hotstrings.htm). Such hotkeys perform a different action (or none at all) depending on the result of an expression.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_If.htm',
        exp: [
            '#IF Expression',
            '; Expression',
            ';   Any valid [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions).',
            '',
            '; Note: Scripts should not assume that the expression is only evaluated when the key is pressed',
            '; Note: Use of #If in an unresponsive script may cause input lag or break hotkeys',
            '',
            '#If WinActive("ahk_class Notepad") or WinActive(MyWindowTitle)',
            '#Space::MsgBox % "You pressed Win+Spacebar in Notepad or " MyWindowTitle "."',
        ],
    },
    IFTIMEOUT: {
        keyRawName: '#IfTimeout',
        insert: '#IfTimeout, ${1:Timeout}',
        doc: 'Sets the maximum time that may be spent evaluating a single #If expression.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_IfTimeout.htm',
        exp: [
            '#IfTimeout Timeout',
            '; Timeout',
            ';   The timeout value to apply globally, in milliseconds.',
            ';   default as 1000 ms',
            '',
            '#IfTimeout 10',
        ],
    },
    IFWINACTIVE: {
        keyRawName: '#IfWinActive',
        insert: '#IfWinActive',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_IfWinActive.htm',
        exp: [
            '#IfWinActive WinTitle, WinText',
            '#IfWinExist WinTitle, WinText',
            '#IfWinNotActive WinTitle, WinText',
            '#IfWinNotExist WinTitle, WinText',
            '#If , Expression',
        ],
    },
    IFWINEXIST: {
        keyRawName: '#IfWinExist',
        insert: '#IfWinExist',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_IfWinActive.htm',
        exp: [
            '#IfWinActive WinTitle, WinText',
            '#IfWinExist WinTitle, WinText',
            '#IfWinNotActive WinTitle, WinText',
            '#IfWinNotExist WinTitle, WinText',
            '#If , Expression',
        ],
    },
    IFWINNOTACTIVE: {
        keyRawName: '#IfWinNotActive',
        insert: '#IfWinNotActive',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_IfWinActive.htm',
        exp: [
            '#IfWinActive WinTitle, WinText',
            '#IfWinExist WinTitle, WinText',
            '#IfWinNotActive WinTitle, WinText',
            '#IfWinNotExist WinTitle, WinText',
            '#If , Expression',
        ],
    },
    IFWINNOTEXIST: {
        keyRawName: '#IfWinNotExist',
        insert: '#IfWinNotExist',
        doc: 'This directive was removed. AutoIt scripts are no longer supported.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_IfWinActive.htm',
        exp: [
            '#IfWinActive WinTitle, WinText',
            '#IfWinExist WinTitle, WinText',
            '#IfWinNotActive WinTitle, WinText',
            '#IfWinNotExist WinTitle, WinText',
            '#If , Expression',
        ],
    },
    INPUTLEVEL: {
        keyRawName: '#InputLevel',
        insert: '#InputLevel, ${1:0}',
        doc: 'Controls which artificial keyboard and mouse events are ignored by hotkeys and hotstrings. [Level] - An integer between 0 and 100. If omitted, it defaults to 0.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_InputLevel.htm',
        exp: [
            '#InputLevel Level',
            '; Level',
            ';    An integer between 0 and 100. If omitted, it defaults to 0.',
            '',
            '#InputLevel 1',
            'Numpad0::LButton',
            '#InputLevel 0',
            '; This hotkey can be triggered by both Numpad0 and LButton:',
            '~LButton::MsgBox Clicked',
        ],
    },
    INSTALLKEYBDHOOK: {
        keyRawName: '#InstallKeybdHook',
        insert: '#InstallKeybdHook',
        doc: 'Forces the unconditional installation of the keyboard hook.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_InstallKeybdHook.htm',
        exp: [
            '#InstallKeybdHook',
        ],
    },
    INSTALLMOUSEHOOK: {
        keyRawName: '#InstallMouseHook',
        insert: '#InstallMouseHook',
        doc: 'Forces the unconditional installation of the mouse hook.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_InstallKeybdHook.htm',
        exp: [
            '#InstallMouseHook',
        ],
    },
    KEYHISTORY: {
        keyRawName: '#KeyHistory',
        insert: '#KeyHistory, ${1:MaxEvents}',
        doc: 'Sets the maximum number of keyboard and mouse events displayed by the KeyHistory window. You can set it to 0 to disable key history.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_InstallKeybdHook.htm',
        exp: [
            '#KeyHistory MaxEvents',
            '; MaxEvents as int',
            ';    The maximum number of keyboard and mouse events displayed by the KeyHistory window (default 40, limit 500). Specify 0 to disable key history entirely.',
            '',
            '; exp',
            ';   Causes KeyHistory to display the last 100 instead 40 keyboard and mouse events.',
            '#KeyHistory 100',
        ],
    },
    LTRIM: {
        keyRawName: '#LTrim',
        insert: '#LTrim, ${1|On,Off|}',
        doc: 'LTrim: Omits spaces and tabs at the beginning of each line. This is primarily used to allow the continuation section to be indented. Also, this option may be turned on for multiple continuation sections by specifying #LTrim on a line by itself. #LTrim is positional: it affects all continuation sections physically beneath it. The setting may be turned off via #LTrim Off.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Scripts.htm#LTrim',
        exp: [
            '#LTrim On|Off',
        ],
    },
    MAXHOTKEYSPERINTERVAL: {
        keyRawName: '#MaxHotkeysPerInterval',
        insert: '#MaxHotkeysPerInterval, ${1:Value}',
        doc: 'Along with #HotkeyInterval, specifies the rate of hotkey activations beyond which a warning dialog will be displayed.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MaxHotkeysPerInterval.htm',
        exp: [
            '#MaxHotkeysPerInterval Value',
            '; Value as int',
            ';    The maximum number of hotkeys that can be pressed in the interval specified by #HotkeyInterval without triggering a warning dialog.',
        ],
    },
    MAXMEM: {
        keyRawName: '#MaxMem',
        insert: '#MaxMem, ${1:Megabytes}',
        doc: 'Sets the maximum capacity of each variable to the specified number of megabytes.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MaxMem.htm',
        exp: [
            '#MaxMem Megabytes',
            '; Megabytes as int 1 ~ 4095 (MB)',
            ';    default as 64 ',
            '',
            '; exp :Allows 256 MB instead of 64 MB per variable.',
            '#MaxMem 256',
        ],
    },
    MAXTHREADS: {
        keyRawName: '#MaxThreads',
        insert: '#MaxThreads, ${1:Value}',
        doc: 'Sets the maximum number of simultaneous threads.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MaxThreads.htm',
        exp: [
            '#MaxThreads Value',
            '; Value as int 1 ~ 255 (threads)',
            ';    default as 10 ',
            '',
            '; exp : Allows a maximum of 2 instead of 10 simultaneous threads.',
            '#MaxThreads 2',
        ],
    },
    MAXTHREADSBUFFER: {
        keyRawName: '#MaxThreadsBuffer',
        insert: '#MaxThreadsBuffer, ${1|On,Off|}',
        doc: 'Causes some or all hotkeys to buffer rather than ignore keypresses when their #MaxThreadsPerHotkey limit has been reached.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MaxThreadsBuffer.htm',
        exp: [
            '#MaxThreadsBuffer OnOff',
            '; OnOff as On or Off',
            ';    default as Off ',
            '; This directive is rarely used .',
            '; exp :',
            '#MaxThreadsBuffer On',
        ],
    },
    MAXTHREADSPERHOTKEY: {
        keyRawName: '#MaxThreadsPerHotkey',
        insert: '#MaxThreadsPerHotkey, ${1:Value}',
        doc: 'Sets the maximum number of simultaneous threads per hotkey or hotstring.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MaxThreadsPerHotkey.htm',
        exp: [
            '#MaxThreadsPerHotkey Value',
            '; Value as int && < 255',
            ';    default as 1 ',
            '; This directive is rarely used .',
            '; exp :',
            '#MaxThreadsPerHotkey 3',
        ],
    },
    MENUMASKKEY: {
        keyRawName: '#MenuMaskKey',
        insert: '#MenuMaskKey, ${1:KeyName}',
        doc: 'Changes which key is used to mask `Win` or `Alt` keyup events.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_MenuMaskKey.htm',
        exp: [
            '#MenuMaskKey KeyName',
            '; KeyName as VKnn or SCnnn',
            ';    ',
            '#MenuMaskKey vkFF',
        ],
    },
    NOENV: {
        keyRawName: '#NoEnv',
        insert: '#NoEnv',
        doc: 'Avoids checking empty variables to see if they are environment variables (recommended for all new scripts).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_NoEnv.htm',
        exp: [
            '#NoEnv',
            '; recommended for all new scripts',
        ],
    },
    NOTRAYICON: {
        keyRawName: '#NoTrayIcon',
        insert: '#NoTrayIcon',
        doc: 'Disables the showing of a [tray icon](https://www.autohotkey.com/docs/Program.htm#tray-icon).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_NoTrayIcon.htm',
        exp: [
            '#NoTrayIcon',
        ],
    },
    PERSISTENT: {
        keyRawName: '#Persistent',
        insert: '#Persistent',
        doc: 'Keeps a script permanently running (that is, until the user closes it or [ExitApp](https://www.autohotkey.com/docs/commands/ExitApp.htm) is encountered).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_Persistent.htm',
        exp: [
            '#Persistent',
        ],
    },
    REQUIRES: {
        keyRawName: '#Requires',
        insert: '#Requires ${1:Version}',
        doc: 'Displays an error and quits if a version requirement is not met.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_Requires.htm',
        exp: [
            '#Requires v1.1.33+',
            '',
            '; exp: Causes the script to run only on v1.1.33.00 and later v1.1.* releases.',
            '#Requires AutoHotkey v1.1.33+',
            'MsgBox This script will run only on v1.1.33.00 and later v1.1.* releases.',
        ],
    },
    SINGLEINSTANCE: {
        keyRawName: '#SingleInstance',
        insert: '#SingleInstance, ${1|force,ignore,prompt,off|}',
        doc: 'Determines whether a script is allowed to run again when it is already running.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_SingleInstance.htm',
        exp: [
            '#SingleInstance ForceIgnorePromptOff',
            ';  Force: Skips the dialog box and replaces the old instance automatically.',
            ';  Ignore: Skips the dialog box and leaves the old instance running. In other words, attempts to launch an already-running script are ignored.',
            ';  *Prompt: Displays a dialog box asking whether to keep the old instance or replace it with the new one. This is the default behaviour if this directive is not used.',
            ';  Off: Allows multiple instances of the script to run concurrently.',
            '',
            '#SingleInstance Force',
        ],
    },
    USEHOOK: {
        keyRawName: '#UseHook',
        insert: '#UseHook, ${1|On,Off|}',
        doc: 'Forces the use of the hook to implement all or some keyboard [hotkeys](https://www.autohotkey.com/docs/Hotkeys.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_UseHook.htm',
        exp: [
            '#UseHook OnOff',
            '; OnOff',
            ';   On : The keyboard hook will be used to implement all keyboard hotkeys between here and the next #UseHook OFF (if any).',
            ';   *Off : Hotkeys will be implemented using the default method (RegisterHotkey() if possible; otherwise, the keyboard hook). ',
            '',
            '; exp: Causes the script to run only on v1.1.33.00 and later v1.1.* releases.',
            '#Requires AutoHotkey v1.1.33+',
            'MsgBox This script will run only on v1.1.33.00 and later v1.1.* releases.',
        ],
    },
    WARN: {
        keyRawName: '#Warn',
        insert:
            '#Warn,$0 ${1|All,Unreachable,ClassOverwrite,LocalSameAsGlobal,UseEnv,UseUnsetLocal,UseUnsetGlobal|}, ${2|MsgBox,StdOut,OutputDebug,Off|}',
        doc: 'Enables or disables warnings for specific conditions which may indicate an error, such as a typo or missing "global" declaration.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_Warn.htm',
        exp: [
            '#Warn WarningType, WarningMode',
            '; WarningType',
            ';     All',
            ';     Unreachable',
            ';     ClassOverwrite',
            ';     LocalSameAsGlobal',
            ';     UseEnv',
            ';     UseUnsetLocal',
            ';     UseUnsetGlobal',
            '',
            '; WarningMode',
            ';   MsgBox',
            ';   StdOut',
            ';   OutputDebug',
            ';   Off',
            '',
            '#Warn All, OutputDebug',
        ],
    },
    WINACTIVATEFORCE: {
        keyRawName: '#WinActivateForce',
        insert: '#WinActivateForce',
        doc: 'Skips the gentle method of activating a window and goes straight to the forceful method.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/_Warn.htm',
        exp: [
            '#WinActivateForce',
        ],
    },
};

export function Directives2Md(DirectivesElement: TElement): vscode.MarkdownString {
    const {
        keyRawName,
        doc,
        link,
        exp,
    } = DirectivesElement;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown('#Directives')
        .appendCodeblock(keyRawName, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link})`)
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*')
        .appendCodeblock(exp.join('\n'));

    md.supportHtml = true;
    return md;
}

export const DirectivesMDMap: ReadonlyMap<string, vscode.MarkdownString> = new Map(
    [...Object.entries(DirectivesList)]
        .map(([ukName, BiFunc]: [string, TElement]) => [ukName, Directives2Md(BiFunc)]),
);

const SnippetDirectives: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    // initialize

    const result: vscode.CompletionItem[] = [];
    for (const [ukName, v] of Object.entries(DirectivesList)) {
        const { keyRawName, insert, recommended } = v;
        if (!recommended) continue;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${keyRawName}`, // Left
            description: '#Directives', // Right
        });
        item.kind = vscode.CompletionItemKind.Event;
        item.insertText = new vscode.SnippetString(insert.replace('#', ''));

        item.detail = '#Directives (neko-help)';
        item.documentation = DirectivesMDMap.get(ukName) ?? Directives2Md(v);

        result.push(item);
    }

    return result;
})();

export function Completion2Directives(
    lStr: string,
    position: vscode.Position,
): readonly vscode.CompletionItem[] {
    const subStr = lStr.slice(0, position.character).trim();

    return (/^#\w*$/ui).test(subStr)
        ? SnippetDirectives
        : [];
}
