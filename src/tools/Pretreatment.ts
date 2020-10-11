/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
// import * as vscode from 'vscode';
import { getSkipSign, getLStr } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';
import { inLTrimRange } from './inLTrimRange';
import { TDocArr, TDocArrRaw } from '../globalEnum';

export function Pretreatment(documentAll: readonly string[]): TDocArr {
    const result: TDocArrRaw = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    const lineMax = documentAll.length;
    let deep = 0;
    //  const timeStart = Date.now();
    for (let line = 0; line < lineMax; line++) {
        const textRaw = documentAll[line];

        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) {
            result.push({
                lStr: '', deep, textRaw,
            });
            continue;
        }

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) {
            result.push({
                lStr: '', deep, textRaw,
            });
            continue;
        }

        const lStr = getLStr(textRaw);
        if (getSkipSign(lStr)) {
            result.push({
                lStr: '', deep, textRaw,
            });
            continue;
        }

        // {$                     || ^{
        if ((/\{\s*$/).test(lStr) || (/^\s*\{/).test(lStr)) {
            deep++;
        }
        if ((/^\s*\}/).test(lStr)) {
            deep--; // ^}
        }

        result.push({
            lStr, deep, textRaw,
        });
    }
    //  const g = Object.freeze(result);
    //  const time = Date.now() - timeStart;
    //  console.log(time, ' ms of ', document.fileName, ' Pretreatment ');
    return result;
}
