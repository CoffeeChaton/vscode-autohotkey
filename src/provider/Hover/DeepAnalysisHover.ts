import * as vscode from 'vscode';
import { DeepAnalysisResult, EValType } from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { enumErr } from '../../tools/enumErr';
import { getFnOfPos } from '../../tools/getScopeOfPos';

function getAhkTypeName(e: EValType): 'Static' | 'args' | 'global' | 'local' | 'normal' {
    switch (e) {
        case EValType.Static: return 'Static';
        case EValType.args: return 'args';
        case EValType.global: return 'global';
        case EValType.local: return 'local';
        case EValType.normal: return 'normal';
        default: return enumErr(e);
    }
}
export function DeepAnalysisHover(document: vscode.TextDocument, position: vscode.Position, word: string)
    : vscode.MarkdownString | null {
    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return null;

    const ed: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
    if (!ed) return null;

    const arg = ed.argList.get(word);
    if (arg) {
        const md = new vscode.MarkdownString('', true);
        md.appendMarkdown('is args');
        if (arg.isByRef) md.appendMarkdown('args : isByRef');
        if (arg.isVariadic) md.appendMarkdown('args : isVariadic');
        arg.commentList.forEach((v) => md.appendMarkdown(v));
        return md;
    }

    const value = ed.valList.get(word);
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
