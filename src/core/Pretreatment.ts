/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import type { TAhkTokenLine, TMultilineFlag, TTokenStream } from '../globalEnum';
import { EDetail, EDiagDeep, EMultiline } from '../globalEnum';
import { getIgnore } from '../provider/Diagnostic/getIgnore';
import { ContinueLongLine } from '../provider/Format/ContinueLongLine';
import { getMultiline } from '../tools/str/getMultiline';
import { inCommentBlock } from '../tools/str/inCommentBlock';
import { getLStr, isSetVarTradition } from '../tools/str/removeSpecialChar';

/**
 * @param strArray keep this with readonly string[], don't use String, because of copy.
 *  and without str.spilt(\r?\n), I hate \r
 * @param fileName just debug of deep < 0
 * @returns FFullDocTokenDocStream
 */
export function Pretreatment(strArray: readonly string[], fileName: string): TTokenStream {
    const result: TAhkTokenLine[] = [];
    let CommentBlock = false;
    let multiline: EMultiline = EMultiline.none;
    let multilineFlag: TMultilineFlag = null;
    let deep = 0;
    let line = -1;
    let ignoreLine = 0;
    let ignoreLineP = 0;

    for (const textRaw of strArray) {
        line++;
        const textTrimStart: string = textRaw.trimStart();
        if (deep < 0) {
            console.warn('Pretreatment -> line , deep < 0, fsPath', fileName);
            console.warn('Pretreatment -> line , deep < 0, line', line);
            console.warn('Pretreatment -> line , deep < 0, textTrimStart', textTrimStart);
            deep = 0;
        }
        const temp = getIgnore({
            textTrimStart,
            line,
            ignoreLine,
            ignoreLineP,
        });
        ignoreLine = temp.ignoreLine;
        ignoreLineP = temp.ignoreLineP;
        const displayErr = line > ignoreLine;
        const displayFnErr = line > ignoreLineP;
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
                multiline,
                multilineFlag: null,
                diagDeep: 0,
                displayErr,
                displayFnErr,
            });
            continue;
        }

        [multiline, multilineFlag] = getMultiline(textTrimStart, multiline, multilineFlag);
        if (multiline !== EMultiline.none) {
            result.push({
                fistWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: [],
                line,
                cll: 0,
                lineComment: '',
                multiline,
                multilineFlag,
                diagDeep: 0,
                displayErr,
                displayFnErr,
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
                multiline,
                multilineFlag: null,
                diagDeep: 0,
                displayErr,
                displayFnErr,
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
                multiline,
                multilineFlag: null,
                diagDeep: 0,
                displayErr,
                displayFnErr,
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
                // }   } else RunWait "%AhkPath%" %AhkSw% "%wk%",,Hide

                const diffDeep: number | undefined = lStrTrim
                    .replaceAll(/\s/gu, '')
                    .match(/^(\}+)/u)
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
            multiline,
            multilineFlag: null,
            diagDeep,
            displayErr,
            displayFnErr,
        });
    }

    return result;
}

// let lastFsPath = ''; // vscode.Uri.fsPath
// type THash = number;
// const cacheMap = new Map<THash, TLineErr | 0>();

// LexicalAnalysisSimple
// TODO use hash check line Unaffected && -> getChildren
