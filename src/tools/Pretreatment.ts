/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

import { EDetail, TAhkToken, TTokenStream } from '../globalEnum';
import { inCommentBlock } from './str/inCommentBlock';
import { inLTrimRange } from './str/inLTrimRange';
import { getLStr, isSetVarTradition } from './str/removeSpecialChar';

// self time 520ms~570ms
export function Pretreatment(strArray: readonly string[], startLineBaseZero: number): TTokenStream {
    const result: TAhkToken = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    const OffsetMax: number = strArray.length;
    let deep = 0;
    //  const timeStart = Date.now();
    for (let Offset = 0; Offset < OffsetMax; Offset++) {
        const line: number = Offset + startLineBaseZero;
        const textRaw: string = strArray[Offset].replace(/\r/ug, '');
        const textTrimStart: string = textRaw.trimStart();
        if (deep < 0) {
            console.warn('Pretreatment -> line , deep < 0 ', Offset);
            // void vscode.window.showWarningMessage
            deep = 0;
        }
        CommentBlock = inCommentBlock(textTrimStart, CommentBlock);
        if (CommentBlock) {
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: [EDetail.inComment],
                line,
            });
            continue;
        }

        inLTrim = inLTrimRange(textTrimStart, inLTrim);
        if (inLTrim > 0) {
            const inLTrimLevel = inLTrim === 1
                ? EDetail.inLTrim1
                : EDetail.inLTrim2;
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: [inLTrimLevel],
                line,
            });
            continue;
        }

        if (isSetVarTradition(textTrimStart)) {
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: [EDetail.inSkipSign2],
                line,
            });
            continue;
        }

        const lStr: string = getLStr(textRaw);
        const lStrTrim: string = lStr.trim();
        const detail: EDetail[] = [];
        if (lStrTrim.indexOf('::') === -1) {
            // {$                     || ^{
            if (lStrTrim.endsWith('{') || lStrTrim.startsWith('{')) {
                detail.push(EDetail.deepAdd);
                deep++;
            }
            // ^}
            if (lStrTrim.startsWith('}')) {
                detail.push(EDetail.deepSubtract);
                deep--;
            }
        }

        result.push({
            fistWordUp: lStrTrim.match(/^(\w+)[\s,]+(?!:=)/u)?.[1].toUpperCase() ?? '',
            lStr,
            deep,
            textRaw,
            detail,
            line,
        });
    }
    return result;
}

// let lastFsPath = ''; // vscode.Uri.fsPath
// type THash = number;
// const cacheMap = new Map<THash, TLineErr | 0>();

// LexicalAnalysisSimple
// TODO use hash check line Unaffected && -> getChildren
// FIXME this Need cache && use scanner
