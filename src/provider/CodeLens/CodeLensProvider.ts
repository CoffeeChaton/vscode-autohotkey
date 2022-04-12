import {
    CancellationToken,
    CodeLens,
    CodeLensProvider,
    Command,
    ProviderResult,
    SymbolKind,
    TextDocument,
} from 'vscode';
import { Detecter } from '../../core/Detecter';
import { TTokenStream } from '../../globalEnum';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { TShowAnalyze } from './showFuncAnalyze';

export const enum ECommand {
    ShowFuncAnalyze = 'ahk.nekoHelp.showFuncAnalyze',
}

function CodeLensCore(document: TextDocument): CodeLens[] {
    const { DAList, DocStrMap } = Detecter.updateDocDef(document);
    const { fsPath } = document.uri;

    return DAList
        .filter((DA: TDAMeta): boolean => DA.kind === SymbolKind.Function)
        .map((DA: TDAMeta): CodeLens => {
            const AhkTokenList: TTokenStream = DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1);
            const ahkCommand: Command = {
                title: 'Analyze',
                command: ECommand.ShowFuncAnalyze,
                tooltip: 'by neko-help dev tools',
                arguments: [DA, fsPath, AhkTokenList] as TShowAnalyze,
            };
            return new CodeLens(DA.range, ahkCommand);
        });
}

export const AhkCodeLens: CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(document: TextDocument, _token: CancellationToken): ProviderResult<CodeLens[]> {
        return CodeLensCore(document);
    },
};
