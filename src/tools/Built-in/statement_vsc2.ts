/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-template-curly-in-string */

import * as vscode from 'vscode';

const Statement2: readonly vscode.CompletionItem[] = ((): readonly vscode.CompletionItem[] => {
    const List2: vscode.CompletionItem[] = [];
    const StatementObj = {
        If_between: {
            body: 'If ${1:Var} $0[not] between ${2:Low} and ${3:High}',
            description:
                'Checks whether a [variable\'s](https://www.autohotkey.com/docs/Variables.htm) contents are numerically or alphabetically between two values (inclusive).',
            link: 'https://www.autohotkey.com/docs/commands/IfBetween.htm',
            exp: [
                'if var between 1 and 5',
                '    MsgBox, % var " is in the range 1 to 5, inclusive."',
            ],
        },
        If_contains: {
            body: 'If ${1:Var} $0[not] contains ${2:Value,Value2}',
            description:
                'Checks whether a [variable\'s](https://www.autohotkey.com/docs/Variables.htm) contents match one of the items in a list.',
            link: 'https://www.autohotkey.com/docs/commands/IfIn.htm',
            exp: [
                'if var contains 1,3  ; Note that it compares the values as strings, not numbers.',
                '    MsgBox % "Var contains the digit 1 or 3 (Var could be 1, 3, 10, 21, 23, etc.)"',
            ],
        },
        If_in: {
            body: 'If ${1:Var} $0[not] in ${2:Value,Value2}',
            description:
                'Checks whether a [variable\'s](https://www.autohotkey.com/docs/Variables.htm) contents match one of the items in a list.',
            link: 'https://www.autohotkey.com/docs/commands/IfIn.htm',
            exp: [
                'if var in exe,bat,com',
                '    MsgBox % "The file extension is an executable type."',
            ],
        },
        If_is: {
            body: 'If ${1:Var} is ${2:integer|float|number|digit|xdigit|alpha|upper|lower|alnum|space|time}',
            description: 'Checks whether a variable\'s contents are numeric, uppercase, etc.',
            link: 'https://www.autohotkey.com/docs/commands/IfIs.htm',
            exp: [
                'if var is float',
                '    MsgBox, % var " is a floating point number."',
            ],
        },
        LoopFile: {
            body: 'Loop, Files, ${1:FilePattern}, ${2:Mode?}',
            description: 'Retrieves the specified files or folders, one at a time.',
            link: 'https://www.autohotkey.com/docs/commands/LoopFile.htm',
            exp: [
                'Loop Files, % A_ProgramFiles "\\*.txt", R  ; Recurse into subfolders.',
                '{',
                '    MsgBox, 4, , Filename = %A_LoopFileFullPath%`n`nContinue?',
                '    IfMsgBox, No',
                '        break',
                '}',
            ],
        },
        LoopParse: {
            body: 'Loop, Parse, ${2:InputVar [}, ${3:Delimiters|CSV}, ${4:OmitChars]}',
            description: 'Retrieves substrings (fields) from a string, one at a time.',
            link: 'https://www.autohotkey.com/docs/commands/LoopParse.htm',
            exp: [
                'Colors := "red,green,blue"',
                'Loop, parse, Colors, `,',
                '    MsgBox, % "Color number " A_Index " is " A_LoopField "."',
            ],
        },
        LoopRead: {
            body: 'Loop, Read, ${2:InputFile [}, ${3:OutputFile]}',
            description: 'Retrieves the lines in a text file, one at a time (performs better than FileReadLine).',
            link: 'https://www.autohotkey.com/docs/commands/LoopReadFile.htm',
            exp: [
                'Loop, read, C:\\Log File.txt',
                '    last_line := A_LoopReadLine  ; When loop finishes, this will hold the last line.',
            ],
        },
        LoopReg: {
            body: 'Loop, Reg, ${1:HKLM|HKU|HKCU|HKCR|HKCC [}, ${2:Key}, ${3:IncludeSubkeys?}, ${4:Recurse?]}',
            description: 'Retrieves the contents of the specified registry subkey, one item at a time.',
            link: 'https://www.autohotkey.com/docs/commands/LoopReg.htm',
            exp: [
                ';Deletes Internet Explorer\'s history of URLs typed by the user.',
                'Loop, HKEY_CURRENT_USER, Software\\Microsoft\\Internet Explorer\\TypedURLs',
                '    RegDelete',
            ],
        },
    } as const;

    for (const [keyRawName, v] of Object.entries(StatementObj)) {
        const {
            description,
            body,
            link,
            exp,
        } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: 'Flow of Control',
        });
        item.kind = vscode.CompletionItemKind.Snippet; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Flow of Control (neko-help)';
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendCodeblock(keyRawName, 'ahk')
            .appendMarkdown(description)
            .appendMarkdown(`\n'[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');
        item.documentation = md;

        List2.push(item);
    }
    return List2;
})();

export function getSnipStatement2(subStr: string): readonly vscode.CompletionItem[] {
    return (/^\s*\w*$/ui).test(subStr)
        ? Statement2
        : [];
}
