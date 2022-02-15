import * as vscode from 'vscode';
import { DeepAnalysisResult, EValType } from '../../globalEnum';
import { enumErr } from '../../tools/enumErr';

function getAhkTypeName(e: EValType): 'Static' | 'args' | 'global' | 'local' | 'normal' {
    // dprint-ignore
    switch (e) {
        case EValType.Static: return 'Static';
        case EValType.args: return 'args';
        case EValType.global: return 'global';
        case EValType.local: return 'local';
        case EValType.normal: return 'normal';
        default: return enumErr(e);
    }
}
/**
 * @param word  word.toUpperCase()
 */
export function DeepAnalysisHover(
    ed: DeepAnalysisResult,
    word: string,
): vscode.MarkdownString | null {
    const arg = ed.argMap.get(word);
    if (arg) {
        const md = new vscode.MarkdownString('', true);
        md.appendMarkdown('is args');
        if (arg.isByRef) md.appendMarkdown('(ByRef)');
        if (arg.isVariadic) md.appendMarkdown('(Variadic)');
        arg.commentList.forEach((v) => md.appendMarkdown(v));
        return md;
    }

    const value = ed.valMap.get(word);
    if (value) {
        const md = new vscode.MarkdownString(
            `is ${getAhkTypeName(value.ahkValType)} val of this func`,
            true,
        );
        md.appendMarkdown(value.commentList.join());
        return md;
    }

    return null;
}
