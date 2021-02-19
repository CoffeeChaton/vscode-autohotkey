/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable immutable/no-mutation */
/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { setFuncHoverMD } from '../../tools/setHoverMD';
import { wrapClass } from './wrapClass';
import { insertTextWm } from './insertTextWm';
import { ahkSend } from './ahkSend';
import { getValOfFunc } from '../../tools/Func/getValOfFunc';
import { DeepAnalysisToCompletionItem } from './DeepAnalysisToCompletionItem';

async function getItemSOfEMode(reg: RegExp): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        const AhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) continue;
        for (const ahkSymbol of AhkSymbolList) {
            if (ahkSymbol.kind === vscode.SymbolKind.Class && reg.test(ahkSymbol.name)) {
                const kind = vscode.CompletionItemKind.Class;
                const item = new vscode.CompletionItem(ahkSymbol.name, kind);
                item.insertText = await insertTextWm({ ahkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (ahkSymbol.kind === vscode.SymbolKind.Function && reg.test(ahkSymbol.name)) {
                const kind = vscode.CompletionItemKind.Function;
                const item = new vscode.CompletionItem(ahkSymbol.name, kind);
                item.insertText = await insertTextWm({ ahkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = await setFuncHoverMD({ fsPath, AhkSymbol: ahkSymbol });
                itemS.push(item);
            }
        }
    }
    return itemS;
}
function wrapperOfValOFFuncList(document: vscode.TextDocument, position: vscode.Position, wordLower: string): vscode.CompletionItem[] {
    const valOfFunc = getValOfFunc(document, position, wordLower);
    if (valOfFunc === null) return [];
    const { argItemS, valAssignItemS } = valOfFunc;
    const itemS: vscode.CompletionItem[] = [];

    const argLen = argItemS.length;
    for (let i = 0; i < argLen; i++) {
        const { name, comment, textRawFix } = argItemS[i];
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Variable);
        item.detail = 'neko help';
        item.documentation = new vscode.MarkdownString(`${name}    arg    \n`, true)
            .appendMarkdown('use `f12` or  `shift f12` goto def    \n')
            .appendMarkdown(comment)
            .appendMarkdown('    \n')
            .appendCodeblock(textRawFix);
        itemS.push(item);
    }

    const valLen = valAssignItemS.length;
    for (let i = 0; i < valLen; i++) {
        const {
            name, comment, line, textRawFix,
        } = valAssignItemS[i];
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Variable);
        item.detail = 'neko help';
        item.documentation = new vscode.MarkdownString(`line \`${line + 1}\`    \n`, true)
            .appendMarkdown('use `f12` or  `shift f12` goto def    \n')
            .appendMarkdown(comment)
            .appendMarkdown('    \n')
            .appendCodeblock(textRawFix);
        itemS.push(item);
    }

    return itemS;
}

async function listAllFuncClass(document: vscode.TextDocument, position: vscode.Position, Range: vscode.Range): Promise<vscode.CompletionItem[]> {
    const wordLower = document.getText(Range).toLowerCase();
    const wordStartReg = new RegExp(`^${wordLower}`, 'i');
    const funcOrClassNameList = await getItemSOfEMode(wordStartReg);
    const valOFFuncList = wrapperOfValOFFuncList(document, position, wordLower);
    return [...funcOrClassNameList, ...valOFFuncList];
}

async function wrapListAllFuncClass(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
    const Range = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w\w*\b(?!%)/);
    if (Range === undefined) return []; // exp: . / []

    if (Range.start.character - 1 > -1) {
        const newRange = new vscode.Range(Range.start.line, Range.start.character - 1, Range.start.line, Range.start.character);
        const newStr = document.getText(newRange);
        return (newStr !== '.' && newStr !== '`' && newStr !== '%')
            ? listAllFuncClass(document, position, Range)
            : []; // exp className.d    -->  newStr === "."
    }
    return listAllFuncClass(document, position, Range); // at line start
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<null | vscode.CompletionItem[]> {
        const t1 = Date.now();
        const completions: vscode.CompletionItem[] = [
            ...await wrapClass(document, position), // '.'
            ...await wrapListAllFuncClass(document, position), // ''
            ...ahkSend(document, position), // '{'
            ...DeepAnalysisToCompletionItem(document, position),
            //       ...contextCompletionItem(document, position),
        ];

        console.log('CompletionItemProvider -> time Cost *1000', (Date.now() - t1));

        return completions;
    }
}

/* TODO *1
Functions are assume-local by default. Variables accessed or created inside an assume-local function are local by default,
with the following exceptions:

Super-global variables, including classes.
A dynamic variable reference may resolve to an existing global variable if no local variable exists by that name.
Commands that create pseudo-arrays may create all elements as global even if only the first element is declared.
*/
