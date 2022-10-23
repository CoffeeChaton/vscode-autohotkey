/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */

// BUILT-IN VARIABLES //

import * as vscode from 'vscode';

/**
 * built-in variables
 */

type TBi_VarMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TBi_snippet_list = readonly vscode.CompletionItem[];

export const [Bi_VarMDMap, snippetBiVar] = ((): [TBi_VarMDMap, TBi_snippet_list] => {
    type TBiVElement = {
        keyRawName: string;
        body: string;
        link: `https://www.autohotkey.com/docs/${string}`;
        doc: string;

        exp: readonly string[];
    };

    type TBiKey =
        | 'CLIPBOARD'
        | 'CLIPBOARDALL'
        | 'COMSPEC'
        | 'ERRORLEVEL'
        | 'FALSE'
        | 'PROGRAMFILES'
        | 'TRUE';

    type TBi = {
        [k in TBiKey]: TBiVElement;
    };

    const BiVariables: TBi = {
        CLIPBOARD: {
            keyRawName: 'Clipboard',
            body: 'Clipboard',
            link: 'https://www.autohotkey.com/docs/misc/Clipboard.htm',
            doc: '_Clipboard_ is a built-in [variable](https://www.autohotkey.com/docs/Variables.htm) that reflects the current contents of the Windows clipboard if those contents can be expressed as text. By contrast, _[ClipboardAll](https://www.autohotkey.com/docs/misc/Clipboard.htm#ClipboardAll)_ contains everything on the clipboard, such as pictures and formatting.',

            exp: [
                'clipboard := "my text"   ; Give the clipboard entirely new contents.',
                'clipboard := ""   ; Empty the clipboard.',
                'clipboard := clipboard   ; Convert any copied files, HTML, or other formatted text to plain text.',
                'clipboard := clipboard " Text to append."   ; Append some text to the clipboard.',
                'StringReplace, clipboard, clipboard, ABC, DEF, All   ; Replace all occurrences of ABC with DEF (also converts the clipboard to plain text).',
            ],
        },
        CLIPBOARDALL: {
            keyRawName: 'ClipboardAll',
            body: 'ClipboardAll',
            link: 'https://www.autohotkey.com/docs/misc/Clipboard.htm#ClipboardAll',
            doc: '_ClipboardAll_ contains everything on the clipboard (such as pictures and formatting). It is most commonly used to save the clipboard\'s contents so that the script can temporarily use the clipboard for an operation.',

            exp: [
                'ClipSaved := ClipboardAll   ; Save the entire clipboard to a variable of your choice.',
                '; ... here make temporary use of the clipboard, such as for pasting Unicode text via Transform Unicode ...',
                'Clipboard := ClipSaved   ; Restore the original clipboard. Note the use of Clipboard (not ClipboardAll).',
                'ClipSaved := ""   ; Free the memory in case the clipboard was very large.',
            ],
        },
        COMSPEC: {
            keyRawName: 'ComSpec',
            body: 'ComSpec',
            link: 'https://www.autohotkey.com/docs/Variables.htm#ComSpec',
            doc: 'Contains the same string as the environment\'s ComSpec variable. Often used with [Run/RunWait](https://www.autohotkey.com/docs/commands/Run.htm). For example: `C:\\Windows\\system32\\cmd.exe`',

            exp: [
                ';Runs the dir command in minimized state and stores the output in a text file. After that, the text file and its properties dialog will be opened.',
                '',
                '#Persistent',
                'RunWait, %ComSpec% /c dir C:\\ >>C:\\DirTest.txt, , Min',
                'Run, C:\\DirTest.txt',
                'Run, properties C:\\DirTest.txt',
            ],
        },
        ERRORLEVEL: {
            keyRawName: 'ErrorLevel',
            body: 'ErrorLevel',
            link: 'https://www.autohotkey.com/docs/misc/ErrorLevel.htm',
            doc: 'This is a built-in variable that is set to indicate the success or failure of some of the commands (not all commands change the value of ErrorLevel). A value of 0 usually indicates success, and any other value usually indicates failure. You can also set the value of ErrorLevel yourself.',

            exp: [
                '; Waits a maximum of 1 second until MyWindow exists. If WinWait times out, ErrorLevel is set to 1, otherwise to 0.',
                '',
                'WinWait, MyWindow,, 1',
                'if (ErrorLevel != 0)   ; i.e. it\'s not blank or zero.',
                '    MsgBox, The window does not exist.',
                'else',
                '    MsgBox, The window exists.',
            ],
        },
        FALSE: {
            keyRawName: 'False',
            body: 'False',
            doc: '`0` to represent `false`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/Concepts.htm#boolean).',
            link: 'https://www.autohotkey.com/docs/Variables.htm#misc',
            exp: [
                'False',
                'false',
            ],
        },
        PROGRAMFILES: {
            keyRawName: 'ProgramFiles',
            body: 'ProgramFiles',
            link: 'https://www.autohotkey.com/docs/Variables.htm#ProgramFiles',
            doc: [
                'The Program Files directory (e.g. `C:\\Program Files` or `C:\\Program Files (x86)`). This is usually the same as the _ProgramFiles_ [environment variable](https://www.autohotkey.com/docs/Concepts.htm#environment-variables).',
                '',
                'On [64-bit systems](https://www.autohotkey.com/docs/Variables.htm#Is64bitOS) (and not 32-bit systems), the following applies:',
                '',
                '- If the executable (EXE) that is running the script is 32-bit, A_ProgramFiles returns the path of the "Program Files (x86)" directory.',
                '- For 32-bit processes, the _ProgramW6432_ environment variable contains the path of the 64-bit Program Files directory. On Windows 7 and later, it is also set for 64-bit processes.',
                '- The _ProgramFiles(x86)_ environment variable contains the path of the 32-bit Program Files directory.',
                '',
                '[[v1.0.43.08+]](https://www.autohotkey.com/docs/ChangeLogHelp.htm#Older_Changes "Applies to AutoHotkey v1.0.43.08 and later"): The A_ prefix may be omitted, which helps ease the transition to [#NoEnv](https://www.autohotkey.com/docs/commands/_NoEnv.htm).',
            ].join('\n'),
            exp: [
                'ProgramFiles or A_ProgramFiles',
                '',
                '; Retrieves the version of the file "AutoHotkey.exe" located in AutoHotkey\'s installation directory and stores it in Version.',
                '',
                'FileGetVersion, Version, % A_ProgramFiles "\\AutoHotkey\\AutoHotkey.exe"',
                'MsgBox % "ahk Version is " Version',
            ],
        },
        TRUE: {
            keyRawName: 'True',
            body: 'True',
            doc: '`1` to represent `true`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/Concepts.htm#boolean).',
            link: 'https://www.autohotkey.com/docs/Variables.htm#misc',
            exp: [
                'true',
                'True',
            ],
        },
    } as const;

    function makeMD(Element: TBiVElement): vscode.MarkdownString {
        const {
            body,
            link,
            doc,
            exp,
        } = Element;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`Built-in Variables ([Read Doc](${link}))`)
            .appendMarkdown('\n\n')
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        md.supportHtml = true;
        return md;
    }

    const map1 = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    //
    for (const [k, v] of Object.entries(BiVariables)) {
        const md: vscode.MarkdownString = makeMD(v);
        map1.set(k, md);
        //
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: v.keyRawName, // Left
            description: 'var', // Right
        });
        item.kind = vscode.CompletionItemKind.Variable; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = v.body;
        item.detail = 'Built-in Variables (neko-help)';
        item.documentation = md;
        //
        List2.push(item);
    }

    return [map1, List2];
})();

export function hoverBiVar(wordUp: string): vscode.MarkdownString | undefined {
    return Bi_VarMDMap.get(wordUp);
}
