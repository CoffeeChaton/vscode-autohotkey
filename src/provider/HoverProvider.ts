import * as vscode from 'vscode';
import { tryGetSymbol } from './Def/DefProvider';
import { EMode, TAhkSymbol } from '../globalEnum';
import { setFuncHoverMD } from '../tools/setHoverMD';
import { ClassWm } from '../tools/wm';
import { isPosAtStr } from '../tools/isPosAtStr';
import { DeepAnalysisHover } from './Hover/DeepAnalysisHover';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordLower: string, textRaw: string): Promise<null | vscode.Hover> {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const isFunc = new RegExp(`(?<!\\.|%|\`)(${wordLower})\\(`, 'i'); // not search class.Method()
    if (!isFunc.test(textRaw)) return null;

    const ahkSymbol = tryGetSymbol(wordLower, EMode.ahkFunc);
    if (!ahkSymbol) return null;

    const t = ahkSymbol.AhkSymbol;
    const cache = wm.getWm(t);
    if (cache) return cache;

    const md = await setFuncHoverMD(ahkSymbol);
    const hover = new vscode.Hover(md);

    return wm.setWm(t, hover);
}

export class HoverProvider implements vscode.HoverProvider {
    public async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | null> {
        // eslint-disable-next-line security/detect-unsafe-regex
        const range = document.getWordRangeAtPosition(position, /(?<!\.|`|%)\b\w\w*\b(?!%)/);
        if (!range) {
            // const range2 = document.getWordRangeAtPosition(position, /(?:%)\b\w\w*\b(?:%)/);
            // const word2 = document.getText(range2);
            // const md2 = DeepAnalysisHover(document, position, word2);
            // if (md2) return new vscode.Hover(md2);
            return null;
        }

        if (isPosAtStr(document, position)) {
            console.log('HoverProvider ~ isPosAtStr');
            return null;
        }
        const word = document.getText(range);
        const wordLower = word.toLowerCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordLower, textRaw);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands) return commands;

        const md = DeepAnalysisHover(document, position, word);
        if (md) return new vscode.Hover(md);
        return null;
    }
}
