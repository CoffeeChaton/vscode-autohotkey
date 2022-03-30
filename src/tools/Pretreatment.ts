/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

import { EDetail, TAhkToken, TTokenStream } from '../globalEnum';
import { inCommentBlock } from './str/inCommentBlock';
import { inLTrimRange } from './str/inLTrimRange';
import { getLStr, isSetVarTradition } from './str/removeSpecialChar';

// let lastFsPath = ''; // vscode.Uri.fsPath
// type THash = number;
// const cacheMap = new Map<THash, TLineErr | 0>();

// LexicalAnalysisSimple
// TODO use hash check line Unaffected && -> getChildren
export function Pretreatment(strArray: readonly string[], startLineBaseZero: number): TTokenStream {
    // FIXME this Need cache && use scanner
    const result: TAhkToken = [];
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    const lineMax = strArray.length;
    let deep = 0;
    //  const timeStart = Date.now();
    for (let Offset = 0; Offset < lineMax; Offset++) {
        const line = Offset + startLineBaseZero;
        const textRaw = strArray[Offset].replace(/\r/ug, '');
        if (deep < 0) {
            console.warn(Offset, 'Pretreatment -> line , deep < 0 ');
            // void vscode.window.showWarningMessage
            deep = 0;
        }
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) {
            result.push({
                fistWord: '',
                lStr: '',
                deep,
                textRaw,
                detail: [EDetail.inComment],
                line,
            });
            continue;
        }

        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim > 0) {
            const inLTrimLevel = inLTrim === 1
                ? EDetail.inLTrim1
                : EDetail.inLTrim2;
            result.push({
                fistWord: '',
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
                fistWord: '',
                lStr: '',
                deep,
                textRaw,
                detail: [EDetail.inSkipSign2],
                line,
            });
            continue;
        }

        const lStr = getLStr(textRaw);
        const lStrTrim = lStr.trim();
        const detail: EDetail[] = [];
        if (!lStr.includes('::')) {
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
            fistWord: lStrTrim.match(/^(\w+)[\s,]/u)?.[1].toUpperCase() ?? '',
            lStr,
            deep,
            textRaw,
            detail,
            line,
        });
    }
    return result;
}
