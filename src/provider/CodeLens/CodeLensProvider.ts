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
import { CAhkFuncSymbol, TTokenStream } from '../../globalEnum';
import { TShowAnalyze } from './showFuncAnalyze';
import { TShowUnknownAnalyze } from './showUnknownAnalyze';

export const enum ECommand {
    showFuncAnalyze = 'ahk.nekoHelp.showFuncAnalyze',
    showUnknownAnalyze = 'ahk.nekoHelp.showUnknownAnalyze',
}

function CodeLensCore(document: TextDocument): CodeLens[] {
    const { AhkSymbolList, DocStrMap } = Detecter.updateDocDef(document);
    const { fsPath } = document.uri;

    const need: CodeLens[] = [];
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFuncSymbol && DA.kind === SymbolKind.Function) {
            const AhkTokenList: TTokenStream = DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1);
            const ahkCommand: Command = {
                title: 'Analyze',
                command: ECommand.showFuncAnalyze,
                tooltip: 'by neko-help dev tools',
                arguments: [DA, fsPath, AhkTokenList] as TShowAnalyze,
            };
            need.push(new CodeLens(DA.range, ahkCommand));
            if (DA.textMap.size > 0) {
                const unknownTextCommand: Command = {
                    title: 'unknownText',
                    command: ECommand.showUnknownAnalyze,
                    tooltip: 'by neko-help dev tools',
                    arguments: [DA.textMap, fsPath] as TShowUnknownAnalyze,
                };
                need.push(new CodeLens(DA.range, unknownTextCommand));
            }
        }
    }

    return need;
}

export const AhkCodeLens: CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(document: TextDocument, _token: CancellationToken): ProviderResult<CodeLens[]> {
        return CodeLensCore(document);
    },
};
