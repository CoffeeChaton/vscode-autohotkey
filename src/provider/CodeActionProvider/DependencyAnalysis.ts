import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import type { TAhkFileData } from '../../core/ProjectManager';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';
import type { TShowUnknownAnalyze } from '../CodeLens/showUnknownAnalyze';

export function DependencyAnalysis(
    AhkFileData: TAhkFileData,
    selection: vscode.Range | vscode.Selection,
): vscode.Command[] {
    if (!(selection instanceof vscode.Selection)) return [];
    const { AST, DocStrMap } = AhkFileData;

    const { active } = selection;
    const ahkFn: CAhkFunc | undefined = getFileAllFunc(AST)
        .find((ahkFunc: CAhkFunc): boolean => ahkFunc.nameRange.contains(active));

    if (ahkFn === undefined) return [];

    const need: vscode.Command[] = [];

    const CommandAnalyze: vscode.Command = {
        title: 'Analyze this Function',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            ahkFn,
            DocStrMap.slice(ahkFn.selectionRange.start.line + 1, ahkFn.range.end.line + 1),
        ] as TShowAnalyze,
    };
    need.push(CommandAnalyze);

    if (ahkFn.textMap.size > 0) {
        const unknownTextCommand: vscode.Command = {
            title: 'unknownText',
            command: ECommand.showUnknownAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [ahkFn] as TShowUnknownAnalyze,
        };
        need.push(unknownTextCommand);
    }

    return need;
}
