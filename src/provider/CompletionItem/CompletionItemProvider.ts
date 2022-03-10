/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { ahkSend } from './ahkSend';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { globalValCompletion } from './global/globalValCompletion';
import { isNormalPos } from './isNormalPos';
import { snippetStartWihA } from './json/SnippetStartWihA';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { getStartWithStr } from './util';

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export class CompletionItemProvider implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): Promise<null | vscode.CompletionItem[]> {
        const t1 = Date.now();
        const inputStr = getStartWithStr(document, position);
        const completions: vscode.CompletionItem[] = [
            ...await wrapClass(document, position), // '.'
            ...ahkSend(document, position), // '{'
        ];

        if (context.triggerCharacter !== undefined) {
            console.log('🚀 ~ CompletionItemProvider ~ ...ahkSend ~ context', context);
        }
        if (isNormalPos(document, position)) {
            completions.push(
                ...await listAllFuncClass(inputStr),
                ...DeepAnalysisToCompletionItem(document, position, inputStr),
                ...snippetStartWihA(),
                ...globalValCompletion(document, position, inputStr),
            );
        }
        // TODO #Include list fsPath List && suggest never #include
        console.log('CompletionItemProvider -> time Cost', Date.now() - t1);

        return completions;
    }
}

/*
Functions are assume-local by default. Variables accessed or created inside an assume-local function are local by default,
with the following exceptions:

Super-global variables, including classes.
A dynamic variable reference may resolve to an existing global variable if no local variable exists by that name.
Commands that create pseudo-arrays may create all elements as global even if only the first element is declared.
*/
