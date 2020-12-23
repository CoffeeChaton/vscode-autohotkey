import * as vscode from 'vscode';
import { FuncInputType } from './getChildren';
import { removeParentheses } from '../tools/removeParentheses';
import { removeBigParentheses } from '../tools/removeBigParentheses';

function fnReplacer(match: string, p1: string): string {
    return '_'.repeat(match.length);
}

export function setGlobalVar(FuncInput: FuncInputType): string {
    const {
        DocStrMap, line, lStr, gValMapBySelf,
    } = FuncInput;
    const textRaw = DocStrMap[line].textRaw;
    const e = lStr.replace(/^\s*\bglobal\b/i, fnReplacer);
    if (e.length !== lStr.length) {
        console.log('setGlobalVar ~ lStr', lStr);
        console.log('setGlobalVar ~ e', e);
    }

    const lStrFix = removeParentheses(removeBigParentheses(e));
    if (lStrFix.length !== lStr.length) {
        console.log('setGlobalVar ~ lStr', lStr);
        console.log('setGlobalVar ~ lStrFix', lStrFix);
    }
    return lStrFix.split(',')
        .map((v) => {
            const col = v.indexOf(':=');
            const lName = (col > 0) ? v.substring(0, col).trim() : v.trim();// rVal need to use textRaw
            // eslint-disable-next-line security/detect-non-literal-regexp
            const reg = new RegExp(`\\b${lName}\\b`);
            const col2 = lStrFix.search(reg);
            if (col2 < 0) {
                console.log('textRaw', textRaw);
                console.log('col2 ', col2);
                console.log('lStrFix ', lStrFix);
                console.log('lName ', lName);
            } else {
                const rVal: string | null = (col > 0)
                    ? DocStrMap[line].textRaw.substring(col2 + lName.length, v.length).replace(/\s*:=/, '')
                    : null;
                const newValue = {
                    lRange: new vscode.Range(line, col2, line, col2 + lName.length), //  vscode.Range, // left Range
                    rVal, // string // Right value as textRaw
                };
                const oldVale = gValMapBySelf.get(lName);
                if (oldVale) {
                    const tempV = [...oldVale, newValue];
                    gValMapBySelf.set(lName, tempV);
                } else {
                    gValMapBySelf.set(lName, [newValue]);
                }
            }
            return lName;
        })
        .join(', ')
        .trim();
}
