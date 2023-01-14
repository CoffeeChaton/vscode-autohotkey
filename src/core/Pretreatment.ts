/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */

import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TAhkTokenLine, TMultilineFlag, TTokenStream } from '../globalEnum';
import { EDetail, EMultiline } from '../globalEnum';
import { getIgnore } from '../provider/Diagnostic/getIgnore';
import { ContinueLongLine } from '../provider/Format/ContinueLongLine';
import { log } from '../provider/vscWindows/log';
import { getMultiline } from '../tools/str/getMultiline';
import { getMultilineLStr } from '../tools/str/getMultilineLStr';
import { docCommentBlock, EDocBlock, inCommentBlock } from '../tools/str/inCommentBlock';
import { getLStr } from '../tools/str/removeSpecialChar';
import { isSetVarTradition, SetVarTradition } from '../tools/str/traditionSetVar';
import { getFistWordUpData } from './getFistWordUpData';
import { getSecondUp } from './getSecondUp';
import { callDeep } from './ParserTools/calcDeep';

/**
 * Avoid too many messages
 */
let HintInfoChangeToAhk: 0 | 1 = 0;

function infoAddAhk2(document: vscode.TextDocument, ahkV0: string): 'isAhk2' {
    const { fsPath } = document.uri;

    if (HintInfoChangeToAhk === 0) {
        void vscode.languages.getLanguages().then((langs: string[]): null => {
            if (langs.includes('ahk2')) return null;

            // try {
            //     if (langs.includes('ahk2')) {
            //         await vscode.languages.setTextDocumentLanguage(document, 'ahk2');
            //         return null;
            //     }
            //     await vscode.languages.setTextDocumentLanguage(document, 'plaintext');
            // } catch (error: unknown) {
            //     let message = 'Unknown Error';
            //     if (error instanceof Error) {
            //         message = error.message;
            //     }
            //     if (message !== 'Unknown language id: ahk2') {
            //         console.error(error);
            //         OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error Start------------');
            //         OutputChannel.appendLine(message);
            //         OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error End--------------');
            //         OutputChannel.show();
            //     }
            // }

            const fileName: string = path.basename(fsPath);
            log.info(
                `some file like "${fileName}" is "${ahkV0.trim()}" ;NekoHelp not support ahk2, suggest to use other Extensions`,
            );

            HintInfoChangeToAhk = 1;

            return null;
        });
    }

    // throw new Error(`ahk2 -> ${textTrim} -> ${fsPath}`);
    return 'isAhk2';
}

function getRequiresVersion(textTrimStart: string): 0 | 1 | 2 {
    // #Requires AutoHotkey v2.0-a
    // #Requires AutoHotkey >=2.0- <2.1
    // #Requires AutoHotkey >2.0- <=2.1
    // #Requires AutoHotkey v2.0-rc.2 64-bit
    const Requires: RegExpMatchArray | null = textTrimStart
        .match(/^#Requires[ \t]+AutoHotkey\w*[ \t]+(.*)/iu);

    if (Requires !== null) {
        const ahkV: RegExpMatchArray | null = (Requires[1]).match(/[v>=][ \t]*(\d)\b/iu);
        if (ahkV !== null) {
            if (ahkV[1] === '1') return 1;
            if (ahkV[1] === '2') return 2;
        }
    }

    return 0; // as 'unknown';
}

/**
 * @param strArray keep this with readonly string[], don't use String, because of copy.
 *  and without str.spilt(\r?\n), I hate \r
 */
export function Pretreatment(
    strArray: readonly string[],
    document: vscode.TextDocument,
): TTokenStream | 'isAhk2' {
    let needCheckThisAhk2 = true;
    const result: TAhkTokenLine[] = [];
    let CommentBlock = false;
    let multiline: EMultiline = EMultiline.none;
    let multilineFlag: TMultilineFlag = null;
    let deep = 0;
    let line = -1;
    let ignoreLine = -1;
    let ignoreLineP = -1;

    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];

    for (const textRaw of strArray) {
        line++;

        let ahkDoc = '';
        const textTrimStart: string = textRaw.trimStart();
        if (deep < 0) {
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

        flag = docCommentBlock(textTrimStart, flag);
        if (
            flag === EDocBlock.inDocCommentBlockMid
            && (textTrimStart.startsWith('*') || textTrimStart.startsWith(';'))
        ) {
            // allow '*' and ';'
            const mdLineText = textTrimStart.slice(1);
            if ((/^\s*(?:@|-)/u).test(mdLineText)) {
                fnDocList.push(''); // add \n to-> fnDocList.join('\n');
            }
            fnDocList.push(mdLineText); // **** MD ****** sensitive of \s && \n
        }

        if (flag === EDocBlock.inDocCommentBlockEnd) {
            ahkDoc = fnDocList.join('\n');
            fnDocList.length = 0;
        }

        if (multiline === EMultiline.none) {
            CommentBlock = inCommentBlock(textTrimStart, CommentBlock);
            if (CommentBlock) {
                result.push({
                    fistWordUpCol: -1,
                    fistWordUp: '',
                    SecondWordUpCol: -1,
                    SecondWordUp: '',
                    lStr: '',
                    deep,
                    textRaw,
                    detail: [EDetail.inComment],
                    line,
                    cll: 1,
                    lineComment: '',
                    multiline,
                    multilineFlag: null,
                    displayErr,
                    displayFnErr,
                    ahkDoc,
                });
                continue;
            }
        }

        [multiline, multilineFlag] = getMultiline({
            textTrimStart,
            multiline,
            multilineFlag,
            textRaw,
            result,
            line,
        });
        if (multiline === EMultiline.start || multiline === EMultiline.mid) {
            result.push({
                fistWordUpCol: -1,
                fistWordUp: '',
                SecondWordUpCol: -1,
                SecondWordUp: '',
                lStr: multiline === EMultiline.mid
                    ? getMultilineLStr({ multilineFlag, textRaw })
                    : '',
                deep,
                textRaw,
                detail: [],
                line,
                cll: 1,
                lineComment: '',
                multiline,
                multilineFlag,
                displayErr,
                displayFnErr,
                ahkDoc,
            });
            continue;
        }

        if (textTrimStart.startsWith(';')) {
            result.push({
                fistWordUpCol: -1,
                fistWordUp: '',
                SecondWordUpCol: -1,
                SecondWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail: textTrimStart.startsWith(';;')
                    ? [EDetail.inComment, EDetail.hasDoubleSemicolon]
                    : [EDetail.inComment],
                line,
                cll: 1,
                lineComment: textTrimStart.replace(/^;\s*/u, ''),
                multiline,
                multilineFlag: null,
                displayErr,
                displayFnErr,
                ahkDoc,
            });

            continue;
        }

        if (isSetVarTradition(textTrimStart)) {
            result.push({
                fistWordUpCol: -1,
                fistWordUp: '',
                SecondWordUpCol: -1,
                SecondWordUp: '',
                lStr: SetVarTradition(textRaw),
                deep,
                textRaw,
                detail: [EDetail.inSkipSign2],
                line,
                cll: 0,
                lineComment: '',
                multiline,
                multilineFlag: null,
                displayErr,
                displayFnErr,
                ahkDoc,
            });
            continue;
        }

        if (needCheckThisAhk2) {
            const version: 0 | 1 | 2 = getRequiresVersion(textTrimStart);

            if (version === 2) return infoAddAhk2(document, textTrimStart);
            if (version === 1) needCheckThisAhk2 = false;
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
                fistWordUpCol: -1,
                fistWordUp: '',
                SecondWordUpCol: -1,
                SecondWordUp: '',
                lStr: '',
                deep,
                textRaw,
                detail,
                line,
                cll: 0,
                lineComment,
                multiline,
                multilineFlag: null,
                displayErr,
                displayFnErr,
                ahkDoc,
            });
            continue;
        }

        if (!lStrTrim.includes('::')) {
            // {$                     || ^{
            if (lStrTrim.endsWith('{') || lStrTrim.startsWith('{')) {
                detail.push(EDetail.deepAdd);
                deep++;
                // {{{{
                const addDeep: number = callDeep(lStrTrim, '{');
                if (addDeep > 1) {
                    deep--;
                    deep += addDeep;
                }
            }

            /**
             *  // case of this ....
             *
             * WM_COMMAND(wParam, lParam)
             * {
             *    static view := {
             *    (Join,
             *        65406: "Lines"
             *        65407: "Variables"
             *        65408: "Hotkeys"
             *        65409: "KeyHistory"
             *    )}
             * ;  ^ -----------------------------------------here this ...case
             *    if (wParam = 65410) ; Refresh
             *        return Refresh()
             *    if view[wParam]
             *        return SetView(view[wParam])
             * }
             */
            const lStrTrimFix = lStrTrim.replace(/^\)\s*/u, '');

            // ^}
            if (lStrTrimFix.startsWith('}')) {
                detail.push(EDetail.deepSubtract);
                deep--;

                // eslint-disable-next-line no-tabs
                // }   } else RunWait "%AhkPath%" %AhkSw% "%wk%",,Hide

                const diffDeep: number = callDeep(lStrTrimFix, '}');
                if (diffDeep > 1) {
                    deep++;
                    deep -= diffDeep;
                }
            }
        }

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        const { fistWordUpCol, fistWordUp } = getFistWordUpData({ lStrTrim, lStr, cll });
        const { SecondWordUpCol, SecondWordUp } = getSecondUp(lStr, fistWordUp, fistWordUpCol);

        result.push({
            fistWordUpCol,
            fistWordUp,
            SecondWordUpCol,
            SecondWordUp,
            lStr,
            deep,
            textRaw,
            detail,
            line,
            cll,
            lineComment,
            multiline,
            multilineFlag: null,
            displayErr,
            displayFnErr,
            ahkDoc,
        });
    }

    return result;
}

// LexicalAnalysisSimple
