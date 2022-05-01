import * as vscode from 'vscode';
import { getSnippetBlockFilesList } from '../../configUI';
import { ahkSend } from './ahkSend';
import { BuiltInFunc2Completion } from './autoBuiltInFunc2Completion';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
// import { globalValCompletion } from './global/globalValCompletion';
import { isNormalPos } from './isNormalPos';
import { snippetStartWihA } from './json/SnippetStartWihA';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { getStartWithStr } from './util';

async function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<vscode.CompletionItem[]> {
    const completions: vscode.CompletionItem[] = [
        ...await wrapClass(document, position), // '.'
        ...ahkSend(document, position), // '{'
    ];

    if (isNormalPos(document, position)) {
        const filesBlockList: readonly string[] = getSnippetBlockFilesList();
        const inputStr: string = getStartWithStr(document, position);
        completions.push(
            ...listAllFuncClass(inputStr, filesBlockList),
            ...DeepAnalysisToCompletionItem(document, position, inputStr),
            ...snippetStartWihA,
            ...BuiltInFunc2Completion(inputStr),
            // ...globalValCompletion(document, position, inputStr),
        );
    }
    // TODO #Include list fsPath List && suggest never #include
    // "./path"
    return completions;
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.CompletionContext,
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        return CompletionItemCore(document, position);
    },
};

/*
Functions are assume-local by default. Variables accessed or created inside an assume-local function are local by default,
with the following exceptions:

Super-global variables, including classes.
A dynamic variable reference may resolve to an existing global variable if no local variable exists by that name.
Commands that create pseudo-arrays may create all elements as global even if only the first element is declared.
*/
// TODO https://www.autohotkey.com/docs/KeyList.htm
