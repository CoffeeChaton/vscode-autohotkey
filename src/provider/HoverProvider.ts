/* eslint-disable security/detect-non-literal-regexp */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import {
    DeepAnalysisResult,
    EMode,
    TAhkSymbol,
} from '../globalEnum';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';
import { getFnOfPos } from '../tools/getScopeOfPos';
import { isPosAtStr } from '../tools/isPosAtStr';
import { setFuncHoverMD } from '../tools/setHoverMD';
import { ClassWm } from '../tools/wm';
import { tryGetSymbol } from './Def/DefProvider';
import { DeepAnalysisHover } from './Hover/DeepAnalysisHover';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordUp: string, textRaw: string): Promise<null | vscode.Hover> {
    const isFunc = new RegExp(`(?<![.%\`])(${wordUp})\\(`, 'iu'); // not search class.Method()
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
    // eslint-disable-next-line class-methods-use-this
    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): Promise<vscode.Hover | null> {
        const AhkSymbolList = Detecter.getDocMap(document.uri.fsPath) ?? [];
        for (const ahkSymbol of AhkSymbolList) {
            DeepAnalysis(document, ahkSymbol);
        }
        const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
        let ed: DeepAnalysisResult | null = null;
        if (ahkSymbol) {
            ed = DeepAnalysis(document, ahkSymbol);
        }
        // eslint-disable-next-line security/detect-unsafe-regex
        const range = document.getWordRangeAtPosition(position, /(?<![.`%])\b\w+\b(?!%)/u);
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

        if (ed) {
            const md = DeepAnalysisHover(ed, word.toUpperCase());
            if (md) return new vscode.Hover(md);
        }

        return null;
    }
}
