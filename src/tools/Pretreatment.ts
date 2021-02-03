/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
// import * as vscode from 'vscode';
import { getSkipSign, getLStr, getSkipSign2 } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';
import { inLTrimRange } from './inLTrimRange';
import { TTokenStream, TAhkToken, DetailType } from '../globalEnum';

// LexicalAnalysisSimple

export function Pretreatment(strArray: readonly string[], startLineBaseZero: number): TTokenStream {
    const result: TAhkToken = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    const lineMax = strArray.length;
    let deep = 0;
    //  const timeStart = Date.now();
    for (let Offset = 0; Offset < lineMax; Offset++) {
        const line = Offset + startLineBaseZero;
        const textRaw = strArray[Offset];
        if (deep < 0) {
            console.log(Offset, 'Pretreatment -> line , deep < 0 ');
            deep = 0;
        }
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inComment], line,
            });
            continue;
        }

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) {
            const inLTrimLevel = inLTrim === 1 ? DetailType.inLTrim1 : DetailType.inLTrim2;
            result.push({
                lStr: '', deep, textRaw, detail: [inLTrimLevel], line,
            });
            continue;
        }

        if (getSkipSign(textRaw)) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inSkipSign], line,
            });
            continue;
        }
        if (getSkipSign2(textRaw)) {
            result.push({
                lStr: '', deep, textRaw, detail: [DetailType.inSkipSign2], line,
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
            lStr, deep, textRaw, detail, line,
        });
    }
    //  const g = Object.freeze(result);
    //  const time = Date.now() - timeStart;
    //  console.log(time, ' ms of ', document.fileName, ' Pretreatment ');
    return result;
}
