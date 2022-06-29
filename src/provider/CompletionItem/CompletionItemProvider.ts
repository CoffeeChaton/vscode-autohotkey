import * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { getSnippetCommand } from '../../tools/Built-in/Command';
import { Completion2Directives } from '../../tools/Built-in/DirectivesList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getTopSymbolWithPos } from '../../tools/DeepAnalysis/getTopSymbolWithPos';
import { isPosAtStrNext } from '../../tools/isPosAtStr';
import { ahkSend } from './ahkSend';
import { BuiltInFunc2Completion } from './autoBuiltInFunc2Completion';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { getSnippetStartWihA } from './json/SnippetStartWihA';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { getStartWithStr } from './util';

function getPartStr(lStr: string, position: vscode.Position): string | null {
    const match: RegExpMatchArray | null = lStr
        .substring(0, position.character)
        .match(/(?<![.`{}#])\b(\w+)$/u);

    return match === null
        ? null
        : match[1];
}

function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const AhkFileData: TAhkFileData = Detecter.updateDocDef(document);

    // const t1 = Date.now();
    const { AhkSymbolList, DocStrMap } = AhkFileData;
    const { lStr, textRaw } = DocStrMap[position.line];
    const topSymbol: TTopSymbol | null = getTopSymbolWithPos(AhkSymbolList, position);
    const DA: null | CAhkFunc = getDAWithPos(AhkSymbolList, position);
    const PartStr: string | null = getPartStr(lStr, position);

    const completions: vscode.CompletionItem[] = [
        ...wrapClass(position, textRaw, lStr, topSymbol, DocStrMap, DA), // '.'
        ...ahkSend(document, position), // '{'
        ...Completion2Directives(lStr, position),
    ];

    if (PartStr !== null) {
        completions.push(
            ...getSnippetStartWihA(PartStr),
            ...getSnippetCommand(PartStr),
        );
    }

    if (PartStr !== null && !isPosAtStrNext(textRaw, lStr, position)) {
        const inputStr: string = getStartWithStr(document, position);
        completions.push(
            ...listAllFuncClass(inputStr),
            ...BuiltInFunc2Completion(inputStr),
            // ...globalValCompletion(document, position, inputStr),
        );

        if (DA !== null) completions.push(...DeepAnalysisToCompletionItem(DA, position, inputStr));
    }

    // const t2 = Date.now();
    // console.log('🚀 ~ CompletionItemCore ~ t2', t2 - t1);
    // console.log('🚀 ~ CompletionItemCore ~ context.triggerCharacter', context.triggerCharacter);

    return completions;
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
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

// TODO #Include list fsPath List && suggest never #include
// "./path"
