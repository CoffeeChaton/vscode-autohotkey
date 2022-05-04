import * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { BuiltInFuncMDMap } from '../../tools/Built-in/func';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getGlobalMarkdown } from '../../tools/MD/getGlobalMarkdown';
import { DeepAnalysisHover } from './DeepAnalysisHover';

function HoverOfFunc(wordUp: string, textRaw: string): null | vscode.Hover {
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
    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (range === undefined) return null;

    if (isPosAtStr(document, position)) return null;

    const wordUp: string = document.getText(range).toUpperCase();
    const textRaw: string = document.lineAt(position).text;

    // TODO https://www.autohotkey.com/docs/commands/index.htm
    // const commands = getCommandsHover(document, position);
    // if (commands !== null) return commands;

    const DA: CAhkFunc | undefined = getDAWithPos(document.uri.fsPath, position);
    if (DA !== undefined) {
        const md: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp, position);
        if (md !== null) return new vscode.Hover(md);
    }

    const haveFunc: vscode.Hover | null = HoverOfFunc(wordUp, textRaw);
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
