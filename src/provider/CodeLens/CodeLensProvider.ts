import {
    CancellationToken,
    CodeLens,
    CodeLensProvider,
    Command,
    ProviderResult,
    TextDocument,
} from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { TShowAnalyze } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import { ECommand } from '../../command/ECommand';
import { getCodeLenConfig } from '../../configUI';
import { Detecter, TAhkFileData } from '../../core/Detecter';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { TShowUnknownAnalyze } from './showUnknownAnalyze';

function CodeLensCore(fsPath: string): CodeLens[] {
    const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];

    const { AhkSymbolList, DocStrMap } = AhkFileData;

    const need: CodeLens[] = [];
    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);
    for (const DA of DAList) {
        const CommandAnalyze: Command = {
            title: 'Analyze',
            command: ECommand.showFuncAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [
                DA,
                DocStrMap.slice(DA.selectionRange.start.line + 1, DA.range.end.line + 1),
            ] as TShowAnalyze,
        };
        need.push(new CodeLens(DA.range, CommandAnalyze));

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
        return getCodeLenConfig()
            ? CodeLensCore(document.uri.fsPath)
            : null;
    },
};
