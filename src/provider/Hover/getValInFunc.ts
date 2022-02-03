import * as vscode from 'vscode';
import { EValType, TAhkSymbol } from '../../globalEnum';
import { enumErr } from '../../tools/enumErr';
import { getFnModeWM } from '../../tools/Func/getFnMode';
import { getCommentOfLine } from '../../tools/getCommentOfLine';
import { Pretreatment } from '../../tools/Pretreatment';
import { ahkValRegex } from '../../tools/regexTools';
import { getDefType } from './getDefType';

function setAhkValFirstStr(ahkType: EValType.local | EValType.global | EValType.Static): string {
    switch (ahkType) {
        case EValType.local: return 'is local val';
        case EValType.global: return 'is global val';
        case EValType.Static: return 'is Static val';
        default: return enumErr(ahkType);
    }
}
function wrapToHoverMd(inPut: [EValType.local | EValType.global | EValType.Static, string[]] | null): vscode.MarkdownString | null {
    if (!inPut) return null;
    const [ahkType, comment] = inPut;
    const firstStr = setAhkValFirstStr(ahkType);
    const md = new vscode.MarkdownString(firstStr, true);
    md.appendMarkdown('\n\n');
    comment.forEach((v) => {
        md.appendMarkdown(v).appendMarkdown('\n\n');
    });
    return md;
}

function getValInFuncCore(ahkSymbol: TAhkSymbol, document: vscode.TextDocument, word: string)
    : null | vscode.MarkdownString {
    const DocStrMapSelection = Pretreatment(
        document.getText(ahkSymbol.selectionRange).split('\n'),
        ahkSymbol.selectionRange.start.line,
    );
    const regex = ahkValRegex(word);
    for (const { lStr, textRaw } of DocStrMapSelection) {
        if (lStr.search(regex) > -1) {
            const comment = getCommentOfLine({ lStr, textRaw }) ?? '';
            const md = new vscode.MarkdownString('is args', true)
                .appendMarkdown('\n\n')
                .appendMarkdown(comment);
            return md;
        }
    }

    const DocStrMap = Pretreatment(document.getText(ahkSymbol.range).split('\n'), ahkSymbol.range.start.line);
    const fnMode = getFnModeWM(ahkSymbol, DocStrMap);
    const valType = getDefType({
        fnMode, DocStrMap, regex, ahkSymbol, word,
    });
    return wrapToHoverMd(valType);
}
