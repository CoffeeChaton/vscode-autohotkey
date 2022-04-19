import * as vscode from 'vscode';
import { EMode } from '../../Enum/EMode';
import { CAhkFuncSymbol } from '../../globalEnum';
import { BuiltInFuncMDMap } from '../../tools/Built-in/func';
import { getDAWithName } from '../../tools/DeepAnalysis/getDAWithName';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getGlobalMarkdown } from '../../tools/MD/getGlobalMarkdown';
import { DeepAnalysisHover } from './DeepAnalysisHover';

function HoverFunc(wordUp: string, textRaw: string): null | vscode.Hover {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const DA: CAhkFuncSymbol | null = getDAWithName(wordUp, EMode.ahkFunc);
    if (DA !== null) return new vscode.Hover(DA.md);

    const BuiltInFuncMD: vscode.MarkdownString | undefined = BuiltInFuncMDMap.get(wordUp);
    if (BuiltInFuncMD !== undefined) {
        return new vscode.Hover(BuiltInFuncMD);
    }

    return null;
}

function HoverProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (range === undefined) return null;

    if (isPosAtStr(document, position)) return null;

    const wordUp: string = document.getText(range).toUpperCase();
    const textRaw: string = document.lineAt(position).text;

    // TODO https://www.autohotkey.com/docs/commands/index.htm
    // const commands = getCommandsHover(document, position);
    // if (commands !== null) return commands;

    const DA: CAhkFuncSymbol | undefined = getDAWithPos(document.uri.fsPath, position);
    if (DA !== undefined) {
        const md: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp, position);
        if (md !== null) return new vscode.Hover(md);
    }

    const haveFunc: vscode.Hover | null = HoverFunc(wordUp, textRaw);
    if (haveFunc !== null) return haveFunc;

    const global: vscode.MarkdownString | null = getGlobalMarkdown(wordUp);
    if (global !== null) return new vscode.Hover(global);

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
