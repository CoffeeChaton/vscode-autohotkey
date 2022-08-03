/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import type { TAhkToken, TTokenStream } from '../globalEnum';
import { EDetail, EDiagDeep, ELTrim } from '../globalEnum';
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
    for (const textRaw of strArray) {
        line++;
        const textTrimStart: string = textRaw.trimStart();
        if (deep < 0) {
            console.warn('Pretreatment -> line , deep < 0, fsPath', fileName);
            console.warn('Pretreatment -> line , deep < 0, line', line);
            console.warn('Pretreatment -> line , deep < 0, textTrimStart', textTrimStart);
            deep = 0;
        }

        CommentBlock = inCommentBlock(textTrimStart, CommentBlock); /// TODO {CommentBlock,resultLn} | null
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
                diagDeep: 0,
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
                diagDeep: 0,
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
                diagDeep: 0,
            });
            continue;
        }

        // ---------
        const lStr: string = getLStr(textRaw);
        const lStrTrim: string = lStr.trim();
        const detail: EDetail[] = [];
        const lineComment: string = textRaw.length - lStr.length > 2
            ? textRaw.slice(lStr.length + 1).trim()
            : '';

        if (lineComment.startsWith(';')) {
            detail.push(EDetail.hasDoubleSemicolon);
        }

        if (lStrTrim === '') {
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail,
                line,
                cll: 0,
                lineComment,
                LTrim,
                diagDeep: 0,
            });
            continue;
        }

        let diagDeep: EDiagDeep = EDiagDeep.none;
        if (!lStrTrim.includes('::')) {
            // {$                     || ^{
            if (lStrTrim.endsWith('{') || lStrTrim.startsWith('{')) {
                detail.push(EDetail.deepAdd);
                deep++;
                // {{{{
                const addDeep: number | undefined = lStrTrim
                    .replaceAll(/\s/gu, '')
                    .match(/^(\{+)$/u)
                    ?.[1].length;

                if (addDeep !== undefined && addDeep > 1) {
                    deep--;
                    deep += addDeep;
                    diagDeep = EDiagDeep.multL;
                }
            }
            // ^}
            if (lStrTrim.startsWith('}')) {
                detail.push(EDetail.deepSubtract);
                deep--;

                // eslint-disable-next-line no-tabs
                // if (lStrTrim === '		}	}'.trim())

                // }}}}
                const diffDeep: number | undefined = lStrTrim
                    .replaceAll(/\s/gu, '')
                    .match(/^(\}+)$/u)
                    ?.[1].length;

                if (diffDeep !== undefined && diffDeep > 1) {
                    deep++;
                    deep -= diffDeep;
                    diagDeep = EDiagDeep.multR;
                }
            }
        }

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        const fistWordUp: string = lStrTrim.match(/^(\w+)$/u)?.[1].toUpperCase()
            ?? lStrTrim.match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1].toUpperCase()
            ?? '';

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
            diagDeep,
        });
    }

    return result;
}

// let lastFsPath = ''; // vscode.Uri.fsPath
// type THash = number;
// const cacheMap = new Map<THash, TLineErr | 0>();

// LexicalAnalysisSimple
// TODO use hash check line Unaffected && -> getChildren
