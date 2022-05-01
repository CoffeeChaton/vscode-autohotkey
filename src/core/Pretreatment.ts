/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

import { EDetail, TAhkToken, TTokenStream } from '../globalEnum';
import { ContinueLongLine } from '../provider/Format/ContinueLongLine';
import { inCommentBlock } from '../tools/str/inCommentBlock';
import { inLTrimRange } from '../tools/str/inLTrimRange';
import { getLStr, isSetVarTradition } from '../tools/str/removeSpecialChar';

export function Pretreatment(strArray: readonly string[], startLineBaseZero: number, fileName: string): TTokenStream {
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
            console.warn('Pretreatment -> line , deep < 0, fsPath ', fileName);
            console.warn('Pretreatment -> line , deep < 0, line ', line);
            console.warn('Pretreatment -> line , deep < 0, textTrimStart ', textTrimStart);
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
                cll: 0,
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
                cll: 0,
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
                cll: 0,
            });
            continue;
        }

        // ---------
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

        const fistWordUp: string = lStrTrim.match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1].toUpperCase() ?? '';
        if (fistWordUp === 'GLOBAL') {
            detail.push(EDetail.isGlobalLine);
        } // TODO: else   if (fistWordUp === '...') {

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        result.push({
            fistWordUp,
            lStr,
            deep,
            textRaw,
            detail,
            line,
            cll,
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
