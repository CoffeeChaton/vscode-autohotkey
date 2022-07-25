import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter } from '../../core/Detecter';
import { hoverAVar } from '../../tools/Built-in/A_Variables';
import { getHoverCommand, getHoverCommand2 } from '../../tools/Built-in/Command_Tools';
import { BuiltInFuncMDMap } from '../../tools/Built-in/func_tools';

import { getHoverStatement } from '../../tools/Built-in/statement_vsc';
import { hover2winMsgMd } from '../../tools/Built-in/Windows_Messages_Tools';
import { numberFindWinMsg } from '../../tools/Built-in/Windows_MessagesRe_Tools';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getGlobalMarkdown } from '../../tools/MD/getGlobalMarkdown';
import { DeepAnalysisHover } from './DeepAnalysisHover';
import { HoverDirectives } from './HoverDirectives';

function HoverOfFunc(wordUp: string, textRaw: string): vscode.MarkdownString | null {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`#])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const DA: CAhkFunc | null = getFuncWithName(wordUp);
    if (DA !== null) return DA.md;

    const BuiltInFuncMD: vscode.MarkdownString | undefined = BuiltInFuncMDMap.get(wordUp);
    if (BuiltInFuncMD !== undefined) return BuiltInFuncMD;

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

    const AhkFunc: CAhkFunc | null = getDAWithPos(AhkSymbolList, position);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (AhkFunc !== null && AhkFunc.nameRange.contains(position)) {
        return new vscode.Hover(AhkFunc.md);
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

    if (AhkFunc !== null) {
        const DAmd: vscode.MarkdownString | null = DeepAnalysisHover(AhkFunc, wordUp, position);
        if (DAmd !== null) return new vscode.Hover(DAmd);
    }

    const haveFunc: vscode.MarkdownString | null = HoverOfFunc(wordUp, textRaw);
    if (haveFunc !== null) return new vscode.Hover(haveFunc);

    //
    type TFn = (wordUp: string) => vscode.MarkdownString | null | undefined;
    const fnList: TFn[] = [
        getHoverCommand2,
        getGlobalMarkdown,
        getHoverStatement,
        hoverAVar,
        hover2winMsgMd,
        numberFindWinMsg,
    ];

    for (const fn of fnList) {
        const md: vscode.MarkdownString | null | undefined = fn(wordUp);
        if (md !== undefined && md !== null) return new vscode.Hover(md);
    }

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
