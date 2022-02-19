/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { setFuncHoverMD } from '../../tools/setHoverMD';
import { ahkSend } from './ahkSend';
import { DeepAnalysisToCompletionItem } from './DeepAnalysisToCompletionItem';
import { insertTextWm } from './insertTextWm';
import { wrapClass } from './wrapClass';

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

async function listAllFuncClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    Range: vscode.Range,
): Promise<vscode.CompletionItem[]> {
    const wordUp = document.getText(Range).toUpperCase();
    const wordStartReg = new RegExp(`${wordUp}`, 'iu');
    const funcOrClassNameList = await getItemSOfEMode(wordStartReg);
    return funcOrClassNameList;
}

async function wrapListAllFuncClass(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<vscode.CompletionItem[]> {
    // eslint-disable-next-line security/detect-unsafe-regex
    const Range = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (Range === undefined) return []; // exp: . / []

    if (Range.start.character - 1 > -1) {
        const newRange = new vscode.Range(
            Range.start.line,
            Range.start.character - 1,
            Range.start.line,
            Range.start.character,
        );
        const newStr = document.getText(newRange);
        if (newStr !== '.' && newStr !== '`' && newStr !== '%') {
            const need0 = await listAllFuncClass(document, position, Range);
            return need0;
        }
        return [];
    }
    // at line start
    const ed2 = await listAllFuncClass(document, position, Range);
    return ed2;
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export class CompletionItemProvider implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext,
    ): Promise<null | vscode.CompletionItem[]> {
        const t1 = Date.now();
        const completions: vscode.CompletionItem[] = [
            ...await wrapClass(document, position), // '.'
            ...await wrapListAllFuncClass(document, position), // ''
            ...ahkSend(document, position), // '{'
            ...DeepAnalysisToCompletionItem(document, position),
            //       ...contextCompletionItem(document, position),
        ];

        console.log('CompletionItemProvider -> time Cost *1000', Date.now() - t1);

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
