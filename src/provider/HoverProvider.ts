/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { tryGetSymbol } from './Def/DefProvider';
import { EMode } from '../globalEnum';
import { setFuncHoverMD } from '../tools/setHoverMD';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

const wm: WeakMap<DeepReadonly<vscode.DocumentSymbol>, vscode.Hover> = new WeakMap();

async function HoverFunc(wordLower: string, textRaw: string): Promise<vscode.Hover | false> {
    const isFunc = new RegExp(`(?<!\\.)(${wordLower})\\(`, 'i'); // not search class.Method()
    if (isFunc.test(textRaw) === false) return false;

    const hasSymbol = tryGetSymbol(wordLower, EMode.ahkFunc);
    if (hasSymbol === false) return false;
    const cache = wm.get(hasSymbol.AhkSymbol);
    if (cache !== undefined) {
        //  console.log('WeakMap -> wordLower :', wordLower);
        //  console.log('WeakMap -> fsPath :', hasSymbol.fsPath);
        return cache;
    }

    const Hover = await setFuncHoverMD(hasSymbol);
    wm.set(hasSymbol.AhkSymbol, Hover);
    return Hover;
}

export class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
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
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return undefined;
    }
}
