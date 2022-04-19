import * as vscode from 'vscode';
import { ECommand } from '../../command/ECommand';
import { Detecter } from '../../core/Detecter';
import { CAhkFuncSymbol, TTokenStream } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { TShowAnalyze } from '../CodeLens/showFuncAnalyze';

export function DependencyAnalysis(
    document: vscode.TextDocument,
    selection: vscode.Range | vscode.Selection,
): vscode.Command[] {
    if (!(selection instanceof vscode.Selection)) return [];

    const { fsPath } = document.uri;
    const { active } = selection;
    const DA: CAhkFuncSymbol | undefined = getDAWithPos(fsPath, active);
    if (DA === undefined) return [];

    if (!DA.nameRange.contains(active)) return [];

    const DocStrMap: TTokenStream | undefined = Detecter.getDocMap(fsPath)?.DocStrMap;
    if (DocStrMap === undefined) return [];

    const CommandAnalyze: vscode.Command = {
        title: 'Analyze',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            DA,
            fsPath,
            DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1),
        ] as TShowAnalyze,
    };

    return [CommandAnalyze];
}
