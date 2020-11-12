/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { setFuncHoverMD } from '../../tools/setHoverMD';
import { getValOfFunc } from '../../tools/Func/getValOfFunc';
import { wrapClass } from './wrapClass';
import { ahkSend } from './ahkSend';

async function getItemSOfEMode(reg: RegExp): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        const AhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol.kind === vscode.SymbolKind.Class && reg.test(AhkSymbol.name)) {
                const kind = vscode.CompletionItemKind.Class;
                const item = new vscode.CompletionItem(AhkSymbol.name, kind);
                const document = await vscode.workspace.openTextDocument(fsPath);
                item.insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));
                item.detail = 'neko help';
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (AhkSymbol.kind === vscode.SymbolKind.Function && reg.test(AhkSymbol.name)) {
                const kind = vscode.CompletionItemKind.Function;
                const item = new vscode.CompletionItem(AhkSymbol.name, kind);
                const document = await vscode.workspace.openTextDocument(fsPath);
                item.insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));
                item.detail = 'neko help';
                item.documentation = await setFuncHoverMD({ fsPath, AhkSymbol });
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

async function triggerRegexW(document: vscode.TextDocument, position: vscode.Position, Range: vscode.Range): Promise<vscode.CompletionItem[]> {
    const wordLower = document.getText(Range).toLowerCase();
    // eslint-disable-next-line security/detect-non-literal-regexp
    const wordStartReg = new RegExp(`/^${wordLower}/`, 'i');
    const funcOrClassNameList = await getItemSOfEMode(wordStartReg);
    const valOFFuncList = wrapperOfValOFFuncList(document, position, wordLower);
    return [...funcOrClassNameList, ...valOFFuncList];
}

async function wrapTriggerRegexW(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.CompletionItem[]> {
    const Range = document.getWordRangeAtPosition(position);
    if (Range === undefined) return [];

    if (Range.start.character - 1 > -1) {
        const newRange = new vscode.Range(Range.start.line, Range.start.character - 1, Range.start.line, Range.start.character);
        const newStr = document.getText(newRange).trim();
        if (newStr !== '.') return triggerRegexW(document, position, Range);
    }
    return triggerRegexW(document, position, Range);
}
export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<null | vscode.CompletionItem[]> {
        const t1 = Date.now();
        const completions: vscode.CompletionItem[] = [
            ...await wrapClass(document, position), // '.'
            ...await wrapTriggerRegexW(document, position), // ''
            ...ahkSend(document, position), // '{'
        ];

        // eslint-disable-next-line no-magic-numbers
        console.log('CompletionItemProvider -> timeFinish *1000', (Date.now() - t1) * 1000);

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
