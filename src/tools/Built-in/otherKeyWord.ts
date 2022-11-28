/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-template-curly-in-string */

import * as vscode from 'vscode';
import { CSnippetCommand } from './CSnippetCommand';

const [snippetOtherKeyWord, OtherKeyWordMDMap] = (
    (): [readonly CSnippetCommand[], ReadonlyMap<string, vscode.MarkdownString>] => {
        type TOtherKeyWord = {
            keyRawName: string;
            body: string;
            doc: string;
            recommended: boolean;
            link: `https://www.autohotkey.com/docs/${string}`;
            exp: readonly string[];
        };

        const otherKeyWord = {
            CLASS: {
                keyRawName: 'Class',
                body: 'Class',
                doc: [
                    'At its root, a "class" is a set or category of things having some property or attribute in common.',
                    'Since a [base](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects) or',
                    '[prototype](https://www.autohotkey.com/docs/Objects.htm#Custom_Prototypes) object defines properties and beHaviour for set of objects,',
                    'it can also be called a _class_ object.',
                    'For convenience, base objects can be defined using the "class" keyword as shown below:',
                ].join('\n'),
                recommended: true,
                link: 'https://www.autohotkey.com/docs/Objects.htm#Custom_Classes',
                exp: [
                    'class ClassName extends BaseClassName',
                    '{',
                    '    InstanceVar := Expression',
                    '    static ClassVar := Expression',
                    '',
                    '    class NestedClass',
                    '    {',
                    '        ...',
                    '    }',
                    '',
                    '    Method()',
                    '    {',
                    '        ...',
                    '    }',
                    '',
                    '    Property[]  ; Brackets are optional',
                    '    {',
                    '        get {',
                    '            return ...',
                    '        }',
                    '        set {',
                    '            return ... := value',
                    '        }',
                    '    }',
                    '}',
                ],
            },
            STATIC: {
                keyRawName: 'Static',
                body: 'Static',
                doc: 'Static variables are always implicitly local, but differ from locals because their values are remembered between calls.',
                recommended: true,
                link: 'https://www.autohotkey.com/docs/Functions.htm#static',
                exp: [
                    'LogToFile(TextToLog)',
                    '{',
                    '    Static LoggedLines := 0',
                    '    LoggedLines += 1  ; Maintain a tally locally (its value is remembered between calls).',
                    '    global LogFileName',
                    '    FileAppend, %LoggedLines%: %TextToLog%`n, %LogFileName%',
                    '}',
                ],
            },
            GLOBAL: {
                keyRawName: 'global',
                body: 'global',
                doc: 'To refer to an existing global variable inside a function (or create a new one), declare the variable as global prior to using it.',
                recommended: true,
                link: 'https://www.autohotkey.com/docs/Functions.htm#Global',
                exp: [
                    'global LogFileName  ; This global variable was previously given a value somewhere outside this function.',
                ],
            },
            LOCAL: {
                keyRawName: 'Local',
                body: 'local',
                doc: [
                    'Local variables are specific to a single function and are visible only inside that function.',
                    'Consequently, a local variable may have the same name as a global variable and both will have separate contents.',
                    'Separate functions may also safely use the same variable names.',
                ].join('\n'),
                recommended: true,
                link: 'https://www.autohotkey.com/docs/Functions.htm#Local',
                exp: [
                    'local a',
                    'Local b := 0',
                ],
            },
        } as const satisfies Record<string, TOtherKeyWord>;

        function makeMd(Element: TOtherKeyWord): vscode.MarkdownString {
            const {
                body,
                doc,
                exp,
                link,
            } = Element;
            const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
                .appendMarkdown('other Key Word')
                .appendCodeblock(body, 'ahk')
                .appendMarkdown(`[(Read Doc)](${link})\n\n`)
                .appendMarkdown(doc)
                .appendMarkdown('\n\n***')
                .appendMarkdown('\n\n*exp:*')
                .appendCodeblock(exp.join('\n'), 'ahk');

            md.supportHtml = true;
            return md;
        }

        const map1 = new Map<string, vscode.MarkdownString>();
        const tempList: CSnippetCommand[] = [];

        for (const [k, v] of Object.entries(otherKeyWord)) {
            const md: vscode.MarkdownString = makeMd(v);
            map1.set(k, md);

            tempList.push(new CSnippetCommand(k, v, md));
        }
        return [tempList, map1];
    }
)();

export function getHoverOtherKeyWord(wordUp: string): vscode.MarkdownString | undefined {
    return OtherKeyWordMDMap.get(wordUp);
}

export function getSnippetOtherKeyWord(subStr: string): readonly CSnippetCommand[] {
    return (/^\s*\w*$/ui).test(subStr)
        ? snippetOtherKeyWord
        : [];
}
