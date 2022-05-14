import * as vscode from 'vscode';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { getSnippetBlockFilesList } from '../../configUI';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { Completion2Directives } from '../../tools/Built-in/DirectivesList';
import { ahkSend } from './ahkSend';
import { BuiltInFunc2Completion } from './autoBuiltInFunc2Completion';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
// import { globalValCompletion } from './global/globalValCompletion';
import { isNormalPos } from './isNormalPos';
import { getSnippetStartWihA } from './json/SnippetStartWihA';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { getStartWithStr } from './util';

function getPartStr(lStr: string, position: vscode.Position): string | null {
    const match: RegExpMatchArray | null = lStr
        .substring(0, position.character)
        .match(/(?<![^.`{}])\b(\w+)$/u);

    return match === null
        ? null
        : match[1];
}

function getTopSymbolWithPos(AhkSymbolList: TTopSymbol[], position: vscode.Position): TTopSymbol | null {
    for (const DA of AhkSymbolList) {
        if (DA.range.contains(position)) return DA;
    }
    return null;
}

function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    const AhkFileData: TAhkFileData = Detecter.updateDocDef(document);

    const { AhkSymbolList, DocStrMap } = AhkFileData;
    const { lStr, textRaw } = DocStrMap[position.line];
    const topSymbol: TTopSymbol | null = getTopSymbolWithPos(AhkSymbolList, position);

    const PartStr: string | null = getPartStr(lStr, position);

    const completions: vscode.CompletionItem[] = [
        ...wrapClass(document, position, textRaw, lStr, topSymbol), // '.'
        ...ahkSend(document, position), // '{'
        ...Completion2Directives(lStr, position),
        ...getSnippetStartWihA(PartStr, context.triggerCharacter),
    ];

    if (isNormalPos(document, position)) {
        const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();
        const inputStr: string = getStartWithStr(document, position);
        completions.push(
            ...listAllFuncClass(inputStr, filesBlockList),
            ...DeepAnalysisToCompletionItem(document, position, inputStr),
            ...BuiltInFunc2Completion(inputStr),
            // ...globalValCompletion(document, position, inputStr),
        );
    }

    return completions;
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        return CompletionItemCore(document, position, context);
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
