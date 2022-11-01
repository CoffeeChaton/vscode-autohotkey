import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import { getCodeLenConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import type { TShowUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(fsPath: string): vscode.CodeLens[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const { AST, DocStrMap } = AhkFileData;

    const need: vscode.CodeLens[] = [];
    const DAList: CAhkFunc[] = getDAListTop(AST);
    for (const DA of DAList) {
        const CommandAnalyze: vscode.Command = {
            title: 'Analyze',
            command: ECommand.showFuncAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [
                DA,
                DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1),
            ] as TShowAnalyze,
        };
        need.push(new vscode.CodeLens(DA.range, CommandAnalyze));

        if (DA.textMap.size > 0) {
            const unknownTextCommand: vscode.Command = {
                title: 'unknownText',
                command: ECommand.showUnknownAnalyze,
                tooltip: 'by neko-help dev tools',
                arguments: [DA.textMap, fsPath] as TShowUnknownAnalyze,
            };
            need.push(new vscode.CodeLens(DA.range, unknownTextCommand));
        }
    }

    return need;
}

export const CodeLensProvider: vscode.CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.CodeLens[]> {
        return getCodeLenConfig()
            ? CodeLensCore(document.uri.fsPath)
            : null;
    },
};
