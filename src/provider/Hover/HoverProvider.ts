import * as vscode from 'vscode';
import {
    EMode,
    TAhkSymbol,
    TSymAndFsPath,
} from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { TDeepAnalysisMeta } from '../../tools/DeepAnalysis/FnMetaType';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getFuncDocMD } from '../../tools/MD/getFuncDocMD';
import { tryGetSymbol } from '../../tools/tryGetSymbol';
import { ClassWm } from '../../tools/wm';
import { DeepAnalysisHover } from './DeepAnalysisHover';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordUp: string, textRaw: string): Promise<null | vscode.Hover> {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const testOfFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!testOfFunc.test(textRaw)) return null;

    const data: null | TSymAndFsPath = tryGetSymbol(wordUp, EMode.ahkFunc);
    if (data === null) return null;

    const { AhkSymbol, fsPath } = data;
    const cache: vscode.Hover | undefined = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const md: vscode.MarkdownString = await getFuncDocMD(AhkSymbol, fsPath);
    const hover: vscode.Hover = new vscode.Hover(md);

    return wm.setWm(AhkSymbol, hover);
}

export class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): Promise<vscode.Hover | null> {
        const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
        let DA: TDeepAnalysisMeta | null = null;
        if (ahkSymbol !== null) {
            DA = DeepAnalysis(document, ahkSymbol);
        }
        // eslint-disable-next-line security/detect-unsafe-regex
        const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (range === undefined) return null;

        if (isPosAtStr(document, position)) return null;

        const wordUp: string = document.getText(range).toUpperCase();
        const textRaw: string = document.lineAt(position).text;
        const haveFunc: vscode.Hover | null = await HoverFunc(wordUp, textRaw);
        if (haveFunc !== null) return haveFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands !== null) return commands;

        if (DA !== null) {
            const md: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp);
            if (md !== null) return new vscode.Hover(md);
        }

        return null;
    }
}
