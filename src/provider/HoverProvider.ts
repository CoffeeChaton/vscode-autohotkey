/* eslint-disable no-magic-numbers */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security/detect-non-literal-regexp */
import * as vscode from 'vscode';
import { EMode, TAhkSymbol } from '../globalEnum';
import { isPosAtStr } from '../tools/isPosAtStr';
import { setFuncHoverMD } from '../tools/setHoverMD';
import { ClassWm } from '../tools/wm';
import { tryGetSymbol } from './Def/DefProvider';
import { DeepAnalysisHover } from './Hover/DeepAnalysisHover';

const wm = new ClassWm<TAhkSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordUp: string, textRaw: string): Promise<null | vscode.Hover> {
    const isFunc = new RegExp(`(?<!\\.|%|\`)(${wordUp})\\(`, 'i'); // not search class.Method()
    if (!isFunc.test(textRaw)) return null;

    const ahkSymbol = tryGetSymbol(wordUp, EMode.ahkFunc);
    if (!ahkSymbol) return null;

    const t = ahkSymbol.AhkSymbol;
    const cache = wm.getWm(t);
    if (cache) return cache;

    const md = await setFuncHoverMD(ahkSymbol);
    const hover = new vscode.Hover(md);

    return wm.setWm(t, hover);
}

export class HoverProvider implements vscode.HoverProvider {
    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ): Promise<vscode.Hover | null> {
        const range = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w\w*\b(?!%)/);
        if (!range) {
            // const range2 = document.getWordRangeAtPosition(position, /(?:%)\b\w\w*\b(?:%)/);
            // const word2 = document.getText(range2);
            // const md2 = DeepAnalysisHover(document, position, word2);
            // if (md2) return new vscode.Hover(md2);
            return null;
        }

        if (isPosAtStr(document, position)) return null;

        const word = document.getText(range);
        const wordUp = word.toUpperCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordUp, textRaw);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands) return commands;

        const md = DeepAnalysisHover(document, position, word.toUpperCase());
        if (md) return new vscode.Hover(md);
        return null;
    }
}
