/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */
import * as vscode from 'vscode';
import { removeSpecialChar2 } from './removeSpecialChar';

type FuncDefData = {
    name: string;
    searchLine: number;
};

export function getFuncDef(document: vscode.TextDocument, line: number): FuncDefData | undefined {
    const lineText = (searchLine: number): string => removeSpecialChar2(document.lineAt(searchLine).text).trim();
    const getFuncTail = (searchText: string, name: string, searchLine: number): FuncDefData | undefined => {
        const fnTail = /\)\s*\{$/;
        const fnTail2 = ')';// /\)$/;
        const fnTail3 = '{';// /^\{/;
        // i+1   ^, something , something ........ ) {$
        if (searchText.search(fnTail) > -1) return { name, searchLine };

        if (searchLine + 1 === document.lineCount) return undefined;
        // i+1   ^, something , something ......)$
        // i+2   ^{
        if (searchText.endsWith(fnTail2)
            && lineText(searchLine + 1).startsWith(fnTail3)) return { name, searchLine };

        return undefined;
    };
    const fnHeadMatch = /^(\w\w*)\(/;
    const textFix = lineText(line);
    const fnHead = fnHeadMatch.exec(textFix);
    if (fnHead === null) return undefined;
    const name = fnHead[1];
    const nameLowerCase = name.toLowerCase();
    if (nameLowerCase === 'if' || nameLowerCase === 'while') return undefined;

    const funcData = getFuncTail(textFix, name, line);
    if (funcData) return funcData;

    const firstLineText = lineText(line);
    if (firstLineText.includes(')')) return undefined;// fn_Name( ... ) ...  ,this is not ahk function

    const iMaxRule = 15;
    const iMax = Math.min(line + iMaxRule, document.lineCount, 10000);

    for (let searchLine = line + 1; searchLine < iMax; searchLine += 1) {
        const searchText = lineText(searchLine);
        if (searchText.startsWith(',') === false) return undefined;

        const funcData2 = getFuncTail(searchText, name, searchLine);
        if (funcData2) return funcData2;
    }
    return undefined;
}
