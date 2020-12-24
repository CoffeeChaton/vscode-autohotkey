/* eslint-disable security/detect-non-literal-regexp */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10,60,1000] }] */
import * as vscode from 'vscode';
import { tryGetSymbol } from './Def/DefProvider';
import { EMode, MyDocSymbol } from '../globalEnum';
import { setFuncHoverMD } from '../tools/setHoverMD';
import { ClassWm } from '../tools/wm';

const wm = new ClassWm<MyDocSymbol, vscode.Hover>(10 * 60 * 1000, 'HoverFunc', 60);

async function HoverFunc(wordLower: string, textRaw: string): Promise<null | vscode.Hover> {
    const isFunc = new RegExp(`(?<!\\.)(${wordLower})\\(`, 'i'); // not search class.Method()
    if (!isFunc.test(textRaw)) return null;

    const hasSymbol = tryGetSymbol(wordLower, EMode.ahkFunc);
    if (!hasSymbol) return null;

    const t = hasSymbol.AhkSymbol;
    const cache = wm.getWm(t);
    if (cache) return cache;

    const md = await setFuncHoverMD(hasSymbol);
    const hover = new vscode.Hover(md);

    return wm.setWm(t, hover);
}

export class HoverProvider implements vscode.HoverProvider {
    public async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | null> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        const wordLower = document.getText(Range).toLowerCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordLower, textRaw);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands) return commands;

        return null;
    }
}
