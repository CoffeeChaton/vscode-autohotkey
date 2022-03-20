/* eslint-disable security/detect-non-literal-regexp */
import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    EMode,
    TAhkSymbol,
    TSymAndFsPath,
} from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getFuncDocMD } from '../../tools/MD/getFuncDocMD';
import { ClassWm } from '../../tools/wm';
import { tryGetSymbol } from '../Def/DefProvider';
import { DeepAnalysisHover } from './DeepAnalysisHover';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordUp: string, textRaw: string): Promise<null | vscode.Hover> {
    const isFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
    if (!isFunc.test(textRaw)) return null;

    const data: null | TSymAndFsPath = tryGetSymbol(wordUp, EMode.ahkFunc);
    if (data === null) return null;

    const { AhkSymbol, fsPath } = data;
    const cache: vscode.Hover | undefined = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const md = await getFuncDocMD(AhkSymbol, fsPath);
    const hover = new vscode.Hover(md);

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
        let ed: DeepAnalysisResult | null = null;
        if (ahkSymbol) {
            ed = DeepAnalysis(document, ahkSymbol);
        }
        // eslint-disable-next-line security/detect-unsafe-regex
        const range = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (range === undefined) return null;

        if (isPosAtStr(document, position)) return null;

        const wordUp = document.getText(range).toUpperCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordUp, textRaw);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands) return commands;

        if (ed) {
            const md = DeepAnalysisHover(ed, wordUp);
            if (md) return new vscode.Hover(md);
        }

        return null;
    }
}
