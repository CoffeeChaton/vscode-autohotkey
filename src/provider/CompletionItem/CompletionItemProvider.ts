import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getSnippetStartWihA } from '../../tools/Built-in/A_Variables';
import { snippetBiVar } from '../../tools/Built-in/BiVariables';
import { Completion2Directives } from '../../tools/Built-in/Directives';
import { BuiltInFunc2Completion } from '../../tools/Built-in/func_tools';
import { getSnippetCommand } from '../../tools/Built-in/getSnippetCommand';
import { getSnippetOtherKeyWord } from '../../tools/Built-in/otherKeyWord';
import { ahkSend } from '../../tools/Built-in/Send_tools';
import { getSnippetStatement } from '../../tools/Built-in/statement_vsc';
import { getSnippetWinMsg } from '../../tools/Built-in/Windows_Messages_Tools';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { wrapClass } from './classThis/wrapClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { globalValCompletion } from './global/globalValCompletion';
import { IncludeFsPath } from './Include_fsPath/Include_fsPath';
import { listAllFuncClass } from './listAllFuncClass/listAllFuncClass';
import { ModuleVar2Completion } from './ModuleVar/ModuleVar2Completion';

function getPartStr(lStr: string, position: vscode.Position): string | null {
    const match: RegExpMatchArray | null = lStr
        .slice(0, position.character)
        .match(/(?<![.`{}#])\b(\w+)$/u);

    return match === null
        ? null
        : match[1];
}

function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];
    const { AST, DocStrMap, ModuleVar } = AhkFileData;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr, textRaw } = AhkTokenLine;

    if ((/^\s*#Include(Again)?\s/ui).test(lStr)) return IncludeFsPath(document.uri.fsPath);
    if ((/\bnew[ \t]+\w*$/ui).test(lStr.slice(0, position.character))) {
        // TODO new new Class
        return listAllFuncClass()
            .filter((v: vscode.CompletionItem): boolean => v.kind === vscode.CompletionItemKind.Class);
    }

    const topSymbol: TTopSymbol | undefined = AST.find((top: TTopSymbol): boolean => top.range.contains(position));

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const PartStr: string | null = getPartStr(lStr, position);

    const completions: vscode.CompletionItem[] = [
        ...wrapClass(position, textRaw, lStr, topSymbol, DocStrMap, DA), // '.'
        ...ahkSend(document, position), // '{'
        ...Completion2Directives(lStr, position),
        ...getSnippetOtherKeyWord(lStr, position),
        ...getSnippetCommand(lStr, position),
        ...globalValCompletion(DocStrMap, position),
    ];

    if (PartStr !== null) {
        completions.push(
            ...getSnippetStartWihA(PartStr),
            ...getSnippetStatement(PartStr),
            ...getSnippetWinMsg(PartStr),
            ...snippetBiVar,
            ...ModuleVar2Completion(ModuleVar, DA, PartStr, document.uri.fsPath),
            ...listAllFuncClass(),
            ...BuiltInFunc2Completion(PartStr),
        );

        if (DA !== null) completions.push(...DeepAnalysisToCompletionItem(DA, PartStr));
    }

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
