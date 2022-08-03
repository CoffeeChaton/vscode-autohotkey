import * as vscode from 'vscode';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import { pm } from '../../core/ProjectManager';

export function DependencyAnalysis(
    document: vscode.TextDocument,
    selection: vscode.Range | vscode.Selection,
): vscode.Command[] {
    if (!(selection instanceof vscode.Selection)) return [];
    const { active } = selection;

    const { AST, DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);

    const ahkFn: CAhkFunc | undefined = AST
        .find((top): top is CAhkFunc => top instanceof CAhkFunc && top.nameRange.contains(active));
    if (ahkFn === undefined) {
        return [];
    }

    const CommandAnalyze: vscode.Command = {
        title: 'Analyze this Function',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            ahkFn,
            DocStrMap.slice(ahkFn.selectionRange.start.line + 1, ahkFn.range.end.line + 1),
        ] as TShowAnalyze,
    };

    return [CommandAnalyze];
}
