import * as vscode from 'vscode';
import { ahkValRegex } from '../tools/regexTools';
import { removeBigParentheses } from '../tools/removeBigParentheses';
import { removeParentheses } from '../tools/removeParentheses';
import { FuncInputType } from './getChildren';

function fnReplacer(match: string): string {
    return ' '.repeat(match.length);
}

export function setGlobalVar(FuncInput: FuncInputType): string {
    const {
        DocStrMap,
        line,
        lStr,
        gValMapBySelf,
    } = FuncInput;
    const { textRaw } = DocStrMap[line];
    const lStrFix = removeParentheses(removeBigParentheses(lStr.replace(/^\s*\bglobal\b/ui, fnReplacer)));

    return lStrFix.split(',')
        .map((v) => {
            const col = v.indexOf(':=');
            const lName = (col > 0)
                ? v.substring(0, col).trim()
                : v.trim(); // rVal need to use textRaw;
            const reg = ahkValRegex(lName);
            const col2 = lStrFix.search(reg);
            if (col2 < 0) {
                console.log('textRaw', textRaw);
                console.log('col2 ', col2);
                console.log('lStrFix ', lStrFix);
                console.log('lName ', lName);
                return lName;
            }
            const rVal: string | null = (col > 0)
                ? DocStrMap[line].textRaw.substring(col2 + lName.length, v.length).replace(/\s*:=/u, '')
                : null;
            const newValue = {
                lRange: new vscode.Range(line, col2, line, col2 + lName.length), //  vscode.Range, // left Range
                rVal, // string // Right value is textRaw
            };
            const oldVale = gValMapBySelf.get(lName);
            gValMapBySelf.set(lName, [...oldVale ?? [], newValue]);

            return lName;
        })
        .join(', ')
        .trim();
}
