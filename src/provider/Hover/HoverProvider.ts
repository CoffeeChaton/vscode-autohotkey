import * as vscode from 'vscode';
import { EMode } from '../../globalEnum';
import { getDAWithName } from '../../tools/DeepAnalysis/getDAWithName';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { DeepAnalysisHover } from './DeepAnalysisHover';

function HoverFunc(wordUp: string, textRaw: string): null | vscode.Hover {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const DA: TDAMeta | null = getDAWithName(wordUp, EMode.ahkFunc);

    if (DA === null) return null;

    return new vscode.Hover(DA.md);
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

    const DA: TDAMeta | undefined = getDAWithPos(document, position);
    if (DA !== undefined) {
        const md: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp, position);
        if (md !== null) return new vscode.Hover(md);
    }

    const haveFunc: vscode.Hover | null = HoverFunc(wordUp, textRaw);
    if (haveFunc !== null) return haveFunc;

    return null;
}

export class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        return HoverProviderCore(document, position);
    }
}
