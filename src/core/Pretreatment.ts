/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import * as path from 'node:path';
import * as vscode from 'vscode';
import { isAutoSwitchAhk2 } from '../configUI';
import type { TAhkTokenLine, TMultilineFlag, TTokenStream } from '../globalEnum';
import { EDetail, EDiagDeep, EMultiline } from '../globalEnum';
import { getIgnore } from '../provider/Diagnostic/getIgnore';
import { ContinueLongLine } from '../provider/Format/ContinueLongLine';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { getMultiline } from '../tools/str/getMultiline';
import { getMultilineLStr } from '../tools/str/getMultilineLStr';
import { inCommentBlock } from '../tools/str/inCommentBlock';
import { getLStr } from '../tools/str/removeSpecialChar';
import { isSetVarTradition, SetVarTradition } from '../tools/str/traditionSetVar';
import { getFistWordUpData } from './getFistWordUpData';
import { getSecondUp } from './getSecondUp';
import { callDeep } from './ParserTools/calcDeep';

/**
 * Avoid too many messages
 */
let HintInfoChangeToAhk = 0;

function switchAhk2(document: vscode.TextDocument): 'isAhk2' {
    const { fsPath } = document.uri;

    void vscode.languages.getLanguages().then(async (langs: string[]): Promise<0> => {
        if (isAutoSwitchAhk2()) {
            try {
                await vscode.languages.setTextDocumentLanguage(document, 'ahk2');
            } catch (error: unknown) {
                let message = 'Unknown Error';
                if (error instanceof Error) {
                    message = error.message;
                }
                if (message !== 'Unknown language id: ahk2') {
                    console.error(error);
                    OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error Start------------');
                    OutputChannel.appendLine(message);
                    OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error End--------------');
                    OutputChannel.show();
                }
            }
        }

        if (!langs.includes('ahk2') && HintInfoChangeToAhk === 0) {
            const fileName: string = path.basename(fsPath);
            const suggest = 'https://marketplace.visualstudio.com/items?itemName=thqby.vscode-autohotkey2-lsp';
            void vscode.window.showInformationMessage(
                // eslint-disable-next-line max-len
                `some file like "${fileName}" is "#Requires AutoHotkey v2",\n NekoHelp is not support ahk2,\n suggest to use [AutoHotkey v2 Language Support](${suggest})`,
            );
            HintInfoChangeToAhk = 1;
        }

        return 0;
    });

    // throw new Error(`ahk2 -> ${textTrim} -> ${fsPath}`);
    return 'isAhk2';
}

/**
 * @param strArray keep this with readonly string[], don't use String, because of copy.
 *  and without str.spilt(\r?\n), I hate \r
 * @returns FFullDocTokenDocStream
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

    for (const textRaw of strArray) {
        line++;
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
                diagDeep: 0,
                displayErr,
                displayFnErr,
            });
            continue;
        }

        if (needCheckThisAhk2) {
            // #Requires AutoHotkey v1.1.33+
            const ahkV: RegExpMatchArray | null = textTrimStart
                .match(/^#Requires[ \t]+AutoHotkey[ \t]+v(\d)\b/iu);
            if (ahkV !== null) {
                if (ahkV[1] === '1') needCheckThisAhk2 = false;
                if (ahkV[1] === '2') return switchAhk2(document);
            }
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
                const addDeep: number = callDeep(lStrTrim, '{');
                if (addDeep > 1) {
                    deep--;
                    deep += addDeep;
                    diagDeep = EDiagDeep.multL;
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
                    diagDeep = EDiagDeep.multR;
                }
            }
        }

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        const { fistWordUpCol, fistWordUp } = getFistWordUpData({ lStrTrim, lStr, cll });
        const { SecondWordUpCol, SecondWordUp } = getSecondUp(lStr, fistWordUp);

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
