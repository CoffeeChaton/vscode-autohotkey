/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { DeepAnalysisResult, TAhkSymbolList } from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { DA2SemanticHighlight } from './DA2SemanticHighlight';
import {
    pushToken,
    TokenModifiers,
    TokenTypes,
    TSemanticTokensLeaf,
} from './TypeEnum';

// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend = new vscode.SemanticTokensLegend(
    TokenTypes as unknown as string[],
    TokenModifiers as unknown as string[],
);

function DAList2SemanticHighlight(
    document: vscode.TextDocument,
    SemanticRange: vscode.Range,
    AhkSymbolList: TAhkSymbolList,
    Collector: vscode.SemanticTokensBuilder,
): void {
    for (const ahkSymbol of AhkSymbolList) {
        const newRange: vscode.Range | undefined = ahkSymbol.range.intersection(SemanticRange);
        if (newRange === undefined) continue;

        const DA: DeepAnalysisResult | null = DeepAnalysis(document, ahkSymbol);
        if (DA === null) continue;
        const token: TSemanticTokensLeaf[] = DA2SemanticHighlight(DA);
        pushToken(token, Collector);
    }
}
// core-------------------------------------
async function SemanticTokensCore(
    document: vscode.TextDocument,
    SemanticRange: vscode.Range,
): Promise<vscode.SemanticTokens> {
    const {
        AhkSymbolList,
    } = await Detecter.updateDocDef(document.uri);

    const Collector: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    DAList2SemanticHighlight(document, SemanticRange, AhkSymbolList, Collector);
    // AVariables2SemanticHighlight(DocStrMap, Collector, SemanticRange);

    return Collector.build();
}

// semantic token type
export class AhkDocumentRangeSemanticTokensProvider implements vscode.DocumentRangeSemanticTokensProvider {
    public provideDocumentRangeSemanticTokens(
        document: vscode.TextDocument,
        SemanticRange: vscode.Range,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        return SemanticTokensCore(document, SemanticRange);
    }
}
