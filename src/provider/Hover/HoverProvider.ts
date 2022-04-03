import * as vscode from 'vscode';
import { EMode, TSymAndFsPath } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { TDeepAnalysisMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getFuncDocMD } from '../../tools/MD/getFuncDocMD';
import { tryGetSymbol } from '../../tools/tryGetSymbol';
import { DeepAnalysisHover } from './DeepAnalysisHover';

async function HoverFunc(wordUp: string, textRaw: string): Promise<null | vscode.Hover> {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const data: null | TSymAndFsPath = tryGetSymbol(wordUp, EMode.ahkFunc);
    if (data === null) return null;

    const { AhkSymbol, fsPath } = data;

    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
    const md: vscode.MarkdownString = getFuncDocMD(AhkSymbol, fsPath, document);
    return new vscode.Hover(md);
}

async function HoverProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): Promise<vscode.Hover | null> {
    // eslint-disable-next-line security/detect-unsafe-regex
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (range === undefined) return null;

    if (isPosAtStr(document, position)) return null;

    const wordUp: string = document.getText(range).toUpperCase();
    const textRaw: string = document.lineAt(position).text;

    // TODO https://www.autohotkey.com/docs/commands/index.htm
    // const commands = getCommandsHover(document, position);
    // if (commands !== null) return commands;

    const DA: TDeepAnalysisMeta | null = getDAWithPos(document, position);
    if (DA !== null) {
        const md: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp);
        if (md !== null) return new vscode.Hover(md);
    }

    const haveFunc: vscode.Hover | null = await HoverFunc(wordUp, textRaw);
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
