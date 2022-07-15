import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { getHoverCommand, getHoverCommand2 } from '../../tools/Built-in/Command';
import { BuiltInFuncMDMap } from '../../tools/Built-in/func';
import { getHoverStatement } from '../../tools/Built-in/statement';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getGlobalMarkdown } from '../../tools/MD/getGlobalMarkdown';
import { DeepAnalysisHover } from './DeepAnalysisHover';
import { HoverDirectives } from './HoverDirectives';

function HoverOfFunc(wordUp: string, textRaw: string): vscode.Hover | null {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`#])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const DA: CAhkFunc | null = getFuncWithName(wordUp);
    if (DA !== null) return new vscode.Hover(DA.md);

    const BuiltInFuncMD: vscode.MarkdownString | undefined = BuiltInFuncMDMap.get(wordUp);
    if (BuiltInFuncMD !== undefined) return new vscode.Hover(BuiltInFuncMD);

    return null;
}

function HoverProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    const { AhkSymbolList, DocStrMap } = Detecter.getDocMap(document.uri.fsPath) ?? Detecter.updateDocDef(document);

    // pos at Comment range...
    const { lStr, fistWordUp } = DocStrMap[position.line];
    if (position.character > lStr.length) return null;

    // ex: #Warn
    const DirectivesMd: vscode.MarkdownString | undefined = HoverDirectives(position, AhkSymbolList);
    if (DirectivesMd !== undefined) return new vscode.Hover(DirectivesMd);

    const DA: CAhkFunc | null = getDAWithPos(AhkSymbolList, position);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (DA !== null && DA.nameRange.contains(position)) {
        return new vscode.Hover(DA.md);
    }

    const CommandMd: vscode.MarkdownString | undefined = getHoverCommand(fistWordUp, position, lStr);
    if (CommandMd !== undefined) return new vscode.Hover(CommandMd);

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (range === undefined) return null;

    if (isPosAtStr(document, position)) return null;

    const wordUp: string = document.getText(range).toUpperCase();
    const textRaw: string = document.lineAt(position).text;

    // TODO https://www.autohotkey.com/docs/commands/index.htm
    // const commands = getCommandsHover(document, position);
    // if (commands !== null) return commands;

    if (DA !== null) {
        const DAmd: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp, position);
        if (DAmd !== null) return new vscode.Hover(DAmd);
    }

    const haveFunc: vscode.Hover | null = HoverOfFunc(wordUp, textRaw);
    if (haveFunc !== null) return haveFunc;

    const CommandMd2: vscode.MarkdownString | undefined = getHoverCommand2(wordUp);
    if (CommandMd2 !== undefined) return new vscode.Hover(CommandMd2);

    const global: vscode.MarkdownString | null = getGlobalMarkdown(wordUp);
    if (global !== null) return new vscode.Hover(global);

    const StatementMd: vscode.MarkdownString | undefined = getHoverStatement(wordUp);
    if (StatementMd !== undefined) return new vscode.Hover(StatementMd);

    // TODO hover of A_HOTKEY or #warn or sleep
    return null;
}

export const HoverProvider: vscode.HoverProvider = {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        return HoverProviderCore(document, position);
    },
};
