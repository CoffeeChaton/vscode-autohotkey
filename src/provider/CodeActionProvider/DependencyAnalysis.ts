import * as vscode from 'vscode';
import { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import { Detecter } from '../../core/Detecter';
import { CAhkFuncSymbol, TTokenStream } from '../../globalEnum';
import { getFuncWithPos } from '../../tools/DeepAnalysis/getFuncWithPos';

export function DependencyAnalysis(
    document: vscode.TextDocument,
    selection: vscode.Range | vscode.Selection,
): vscode.Command[] {
    if (!(selection instanceof vscode.Selection)) return [];

    const { fsPath } = document.uri;
    const { active } = selection;
    const DA: CAhkFuncSymbol | undefined = getFuncWithPos(fsPath, active);
    if (
        DA === undefined
        || !DA.nameRange.contains(active)
    ) {
        return [];
    }

    const DocStrMap: TTokenStream | undefined = Detecter.getDocMap(fsPath)?.DocStrMap;
    if (DocStrMap === undefined) return [];

    const CommandAnalyze: vscode.Command = {
        title: 'Analyze this Function',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            DA,
            DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1),
        ] as TShowAnalyze,
    };

    return [CommandAnalyze];
}
