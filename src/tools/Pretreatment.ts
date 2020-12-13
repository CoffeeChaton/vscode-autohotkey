/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
// import * as vscode from 'vscode';
import { getSkipSign, getLStr, getSkipSign2 } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';
import { inLTrimRange } from './inLTrimRange';
import { TDocArr, TDocArrRaw, DetailType } from '../globalEnum';

// eslint-disable-next-line max-statements
export function Pretreatment(strArray: readonly string[]): TDocArr {
    const result: TDocArrRaw = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    const lineMax = strArray.length;
    let deep = 0;
    //  const timeStart = Date.now();
    for (let line = 0; line < lineMax; line++) {
        const textRaw = strArray[line];
        if (deep < 0) {
            console.log(line, 'Pretreatment -> line , deep < 0 ');
            deep = 0;
        }
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inComment],
            });
            continue;
        }

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) {
            const inLTrimLevel = inLTrim === 1 ? DetailType.inLTrim1 : DetailType.inLTrim2;
            result.push({
                lStr: '', deep, textRaw, detail: [inLTrimLevel],
            });
            continue;
        }

        if (getSkipSign(textRaw)) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inSkipSign],
            });
            continue;
        }
        if (getSkipSign2(textRaw)) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inSkipSign2],
            });
            continue;
        }
        const lStr = getLStr(textRaw);

        const detail: DetailType[] = [];
        if (!lStr.includes('::')) {
            // {$                     || ^{
            if ((/{\s*$/).test(lStr) || (/^\s*{/).test(lStr)) {
                detail.push(DetailType.deepAdd);
                deep++;
            }
            // ^}
            if ((/^\s*}/).test(lStr)) {
                detail.push(DetailType.deepSubtract);
                deep--;
            }
        }

        result.push({
            lStr, deep, textRaw, detail,
        });
    }
    //  const g = Object.freeze(result);
    //  const time = Date.now() - timeStart;
    //  console.log(time, ' ms of ', document.fileName, ' Pretreatment ');
    return result;
}
