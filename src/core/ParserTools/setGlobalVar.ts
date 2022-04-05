import * as vscode from 'vscode';
import { TGlobalVal, TGValMap } from '../../globalEnum';
import { ahkValRegex } from '../../tools/regexTools';
import { removeBigParentheses } from '../../tools/str/removeBigParentheses';
import { removeParentheses } from '../../tools/str/removeParentheses';
import { TFuncInput } from '../getChildren';

function fnReplacer(match: string): string {
    return ' '.repeat(match.length);
}

export function setGlobalVar(FuncInput: TFuncInput, gValMapBySelf: TGValMap): string {
    const {
        DocStrMap,
        line,
        lStr,
    } = FuncInput;
    const { textRaw } = DocStrMap[line];
    const lStrFix: string = removeParentheses(removeBigParentheses(lStr.replace(/^\s*\bglobal\b[,\s]+/ui, fnReplacer)));

    // can't match global func
    // fn(){
    //     global
    //     a:= 0 // a is global
    //     b := 1 // b is global
    // }

    return lStrFix
        .split(',') // bug: global a := fn_A(x,b,c) , d := fn(e,f:=g)... can't match f ?
        .map((v) => {
            const col = v.indexOf(':=');
            const lName = (col > 0)
                ? v.substring(0, col).trim()
                : v.trim();

            const col2 = lStrFix.search(ahkValRegex(lName)); // bug: global a := fn_A(a,b,c) , a := fn_B() , just find first a
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
                rVal, // Right value is textRaw
                rawName: lName,
            };
            const upName = lName.toUpperCase();
            const oldVale = gValMapBySelf.get(upName);
            gValMapBySelf.set(upName, [...oldVale ?? [], newValue]);

            return lName;
        })
        .join(', ')
        .trim();
}
