import * as vscode from 'vscode';
import type { TAnalyzeFuncRef } from '../../command/AnalyzeFunc/AnalyzeFuncRef';
import type { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import { getCodeLenConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { getFuncRef } from '../Def/getFnRef';
import type { TShowUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(fsPath: string): vscode.CodeLens[] {
    const AhkFileData: TAhkFileData | undefined = pm.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const { AST, DocStrMap, uri } = AhkFileData;

    const need: vscode.CodeLens[] = [];
    for (const fnSymbol of getDAListTop(AST)) {
        const cmd0: vscode.Command = {
            title: 'Analyze',
            command: ECommand.showFuncAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [
                fnSymbol,
                DocStrMap.slice(fnSymbol.selectionRange.start.line + 1, fnSymbol.range.end.line + 1),
            ] satisfies TShowAnalyze,
        };
        need.push(new vscode.CodeLens(fnSymbol.range, cmd0));

        if (fnSymbol.textMap.size > 0) {
            const cmd1: vscode.Command = {
                title: 'unknownText',
                command: ECommand.showUnknownAnalyze,
                tooltip: 'by neko-help dev tools',
                arguments: [fnSymbol] satisfies TShowUnknownAnalyze,
            };
            need.push(new vscode.CodeLens(fnSymbol.range, cmd1));
        }

        const cmd2: vscode.Command = {
            title: `Reference ${getFuncRef(fnSymbol).length}`,
            command: ECommand.AnalyzeFuncRef,
            tooltip: 'by neko-help dev tools',
            arguments: [
                uri,
                fnSymbol.range.start,
                fnSymbol,
            ] satisfies TAnalyzeFuncRef,
        };
        need.push(new vscode.CodeLens(fnSymbol.range, cmd2));
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
