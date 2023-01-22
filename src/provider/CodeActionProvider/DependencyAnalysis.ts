import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAnalyzeFuncRef } from '../../command/AnalyzeFunc/AnalyzeFuncRef';
import type { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import type { TAhkFileData } from '../../core/ProjectManager';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';
import type { TShowUnknownAnalyze } from '../CodeLens/showUnknownAnalyze';

export function DependencyAnalysis(
    AhkFileData: TAhkFileData,
    selection: vscode.Range | vscode.Selection,
    document: vscode.TextDocument,
): vscode.CodeAction[] {
    if (!(selection instanceof vscode.Selection)) return [];
    const { AST, DocStrMap } = AhkFileData;

    const { active } = selection;
    const ahkFn: CAhkFunc | undefined = getFileAllFunc(AST)
        .find((ahkFunc: CAhkFunc): boolean => ahkFunc.nameRange.contains(active));

    if (ahkFn === undefined) return [];

    const need: vscode.CodeAction[] = [];

    const CA1 = new vscode.CodeAction('Analyze this Function');
    CA1.command = {
        title: 'Analyze this Function',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            ahkFn,
            DocStrMap.slice(ahkFn.selectionRange.start.line + 1, ahkFn.range.end.line + 1),
        ] satisfies TShowAnalyze,
    };
    need.push(CA1);

    if (ahkFn.textMap.size > 0) {
        const CA2 = new vscode.CodeAction('unknownText');
        CA2.command = {
            title: 'unknownText',
            command: ECommand.showUnknownAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [ahkFn] satisfies TShowUnknownAnalyze,
        };
        need.push(CA2);
    }

    const CA3 = new vscode.CodeAction('Find All Reference');
    CA3.command = {
        title: 'Find All Reference',
        command: ECommand.AnalyzeFuncRef,
        tooltip: 'by neko-help dev tools',
        arguments: [
            document.uri,
            active,
            ahkFn,
        ] satisfies TAnalyzeFuncRef,
    };
    need.push(CA3);

    return need;
}
