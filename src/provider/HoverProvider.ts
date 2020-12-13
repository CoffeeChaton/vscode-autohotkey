/* eslint-disable security/detect-non-literal-regexp */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10,60,1000] }] */
import * as vscode from 'vscode';
import { tryGetSymbol } from './Def/DefProvider';
import { EMode, MyDocSymbol } from '../globalEnum';
import { setFuncHoverMD } from '../tools/setHoverMD';

let wm: WeakMap<MyDocSymbol, vscode.Hover> = new WeakMap();
let wmSize = 0;
setInterval(() => {
    wm = new WeakMap();
    wmSize = 0;
    console.log('HoverFunc WeakMap clear 10 min');
}, 10 * 60 * 1000); // 10 minute

async function HoverFunc(wordLower: string, textRaw: string): Promise<false | vscode.Hover> {
    const isFunc = new RegExp(`(?<!\\.)(${wordLower})\\(`, 'i'); // not search class.Method()
    if (!isFunc.test(textRaw)) return false;

    const hasSymbol = tryGetSymbol(wordLower, EMode.ahkFunc);
    if (hasSymbol === false) return false;
    const cache = wm.get(hasSymbol.AhkSymbol);
    if (cache !== undefined) {
        //  console.log('WeakMap -> wordLower :', wordLower);
        //  console.log('WeakMap -> AhkSymbol -> range :', hasSymbol.AhkSymbol.range);
        //  console.log('WeakMap -> fsPath :', hasSymbol.fsPath);
        return cache;
    }

    const md = await setFuncHoverMD(hasSymbol);
    const hover = new vscode.Hover(md);
    // eslint-disable-next-line no-magic-numbers
    if (wmSize > 30) {
        wm = new WeakMap();
        wmSize = 0;
        console.log('HoverFunc WeakMap clear of wmSize > 200');
    }
    wm.set(hasSymbol.AhkSymbol, hover);
    wmSize += 1;

    return hover;
}

export class HoverProvider implements vscode.HoverProvider {
    public async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | undefined> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return undefined;
        const wordLower = document.getText(Range).toLowerCase();
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc(wordLower, textRaw);
        if (isFunc !== false) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = getCommandsHover(document, position);
        // if (commands) return commands;

        return undefined;
    }
}
