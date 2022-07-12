/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

import {
    EDetail,
    ELTrim,
    TAhkToken,
    TTokenStream,
} from '../globalEnum';
import { ContinueLongLine } from '../provider/Format/ContinueLongLine';
import { inCommentBlock } from '../tools/str/inCommentBlock';
import { inLTrimRange } from '../tools/str/inLTrimRange';
import { getLStr, isSetVarTradition } from '../tools/str/removeSpecialChar';

/**
 * @param strArray keep this with readonly string[], don't use String, because of copy.
 *  and without str.spilt(\r?\n), I hate \r
 * @param fileName just debug of deep < 0
 * @returns FFullDocTokenDocStream
 */
export function Pretreatment(strArray: readonly string[], fileName: string): TTokenStream {
    const result: TAhkToken = [];
    let CommentBlock = false;
    let LTrim: ELTrim = ELTrim.none;
    let deep = 0;
    let line = -1;
    let lastLineIsGlobal = false;
    for (const textRaw of strArray) {
        line++;
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
                lineComment: '',
                LTrim,
            });
            continue;
        }

        LTrim = inLTrimRange(textTrimStart, LTrim);
        if (LTrim !== ELTrim.none) {
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: [],
                line,
                cll: 0,
                lineComment: '',
                LTrim,
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
                lineComment: '',
                LTrim,
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

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        const fistWordUp: string = lStrTrim.match(/^(\w+)$/u)?.[1].toUpperCase()
            ?? lStrTrim.match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1].toUpperCase()
            ?? '';
        if (fistWordUp === 'GLOBAL') {
            detail.push(EDetail.isGlobalLine);
            lastLineIsGlobal = true;
        } else if (cll === 1 && lastLineIsGlobal) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
        }

        const lineComment: string = textRaw.length - lStr.length > 2
            ? textRaw.substring(lStr.length).trim()
            : '';

        if (lineComment.startsWith(';;')) {
            detail.push(EDetail.hasDoubleSemicolon);
        }

        result.push({
            fistWordUp,
            lStr,
            deep,
            textRaw,
            detail,
            line,
            cll,
            lineComment,
            LTrim,
        });
    }

    return result;
}

// let lastFsPath = ''; // vscode.Uri.fsPath
// type THash = number;
// const cacheMap = new Map<THash, TLineErr | 0>();

// LexicalAnalysisSimple
// TODO use hash check line Unaffected && -> getChildren
