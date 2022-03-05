import * as vscode from 'vscode';
import { TGlobalVal } from '../../globalEnum';
import { ahkValRegex } from '../../tools/regexTools';
import { removeBigParentheses } from '../../tools/str/removeBigParentheses';
import { removeParentheses } from '../../tools/str/removeParentheses';
import { FuncInputType } from '../getChildren';

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
    const lStrFix = removeParentheses(removeBigParentheses(lStr.replace(/^\s*\bglobal\b[,\s]+/ui, fnReplacer)));

    return lStrFix.split(',')
        .map((v) => {
            const col = v.indexOf(':=');
            const lName = (col > 0)
                ? v.substring(0, col).trim()
                : v.trim(); // rVal need to use textRaw;

            const col2 = lStrFix.search(ahkValRegex(lName));
            if (col2 < 0) {
                console.error('🚀 ~ setGlobalVar ~ FuncInput', FuncInput);
                console.error('line', line);
                console.error('textRaw', textRaw);
                return lName;
            }
            const rVal: string | null = (col > 0)
                ? textRaw
                    .substring(col2 + lName.length, v.length)
                    .replace(/\s*:=/u, '')
                    .trim()
                : null;
            const newValue: TGlobalVal = {
                lRange: new vscode.Range(line, col2, line, col2 + lName.length), //  vscode.Range, // left Range
                rVal, // string // Right value is textRaw
                rawName: lName,
            };
            const oldVale = gValMapBySelf.get(lName.toUpperCase());
            gValMapBySelf.set(lName.toUpperCase(), [...oldVale ?? [], newValue]);

            return lName;
        })
        .join(', ')
        .trim();
}
