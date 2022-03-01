/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

import { DetailType, TAhkToken, TTokenStream } from '../globalEnum';
import { inCommentBlock } from './str/inCommentBlock';
import { inLTrimRange } from './str/inLTrimRange';
import { getLStr, isSetVarTradition } from './str/removeSpecialChar';

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
            console.warn(Offset, 'Pretreatment -> line , deep < 0 ');
            // void vscode.window.showWarningMessage
            deep = 0;
        }
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) {
            result.push({
                lStr: '',
                deep,
                textRaw,
                detail: [DetailType.inComment],
                line,
            });
            continue;
        }

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) {
            const inLTrimLevel = inLTrim === 1
                ? DetailType.inLTrim1
                : DetailType.inLTrim2;
            result.push({
                lStr: '',
                deep,
                textRaw,
                detail: [inLTrimLevel],
                line,
            });
            continue;
        }

        if (isSetVarTradition(textRaw)) {
            result.push({
                lStr: '',
                deep,
                textRaw,
                detail: [DetailType.inSkipSign2],
                line,
            });
            continue;
        }
        const lStr = getLStr(textRaw);

        const detail: DetailType[] = [];
        if (!lStr.includes('::')) {
            // {$                     || ^{
            if ((/\{\s*$/u).test(lStr) || (/^\s*\{/u).test(lStr)) {
                detail.push(DetailType.deepAdd);
                deep++;
            }
            // ^}
            if ((/^\s*\}/u).test(lStr)) {
                detail.push(DetailType.deepSubtract);
                deep--;
            }
        }

        result.push({
            lStr,
            deep,
            textRaw,
            detail,
            line,
        });
    }
    return result;
}
