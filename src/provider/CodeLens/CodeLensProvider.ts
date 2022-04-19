import {
    CancellationToken,
    CodeLens,
    CodeLensProvider,
    Command,
    ProviderResult,
    TextDocument,
} from 'vscode';
import { ECommand } from '../../command/ECommand';
import { Detecter } from '../../core/Detecter';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { TShowUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(document: TextDocument): CodeLens[] {
    const { fsPath } = document.uri;
    const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return [];

    const need: CodeLens[] = [];
    const DAList: CAhkFuncSymbol[] = getDAList(AhkSymbolList);
    for (const DA of DAList) {
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

    return need;
}

export const AhkCodeLens: CodeLensProvider = {
    // onDidChangeCodeLenses?: Event<void> | undefined;
    provideCodeLenses(document: TextDocument, _token: CancellationToken): ProviderResult<CodeLens[]> {
        return CodeLensCore(document);
    },
};
