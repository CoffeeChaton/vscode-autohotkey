import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/Detecter';
import { Detecter } from '../../core/Detecter';
import { DAList2SemanticHighlight } from './DAList2SemanticHighlight';
import { GlobalHighlight } from './GlobalHighlight';
import { inLTrimHighlight } from './inLTrimHighlight';
import { pushToken, TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

const wm = new WeakMap<TAhkFileData, vscode.SemanticTokens>();

function SemanticTokensCore(document: vscode.TextDocument): vscode.SemanticTokens {
    const AhkFileData: TAhkFileData = Detecter.updateDocDef(document);
    const cache: vscode.SemanticTokens | undefined = wm.get(AhkFileData);
    if (cache !== undefined) return cache;

    const {
        GValMap,
        AhkSymbolList,
        DocStrMap,
    } = AhkFileData;

    const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    pushToken([
        ...DAList2SemanticHighlight(AhkSymbolList),
        ...GlobalHighlight(GValMap),
        ...inLTrimHighlight(DocStrMap),
    ], tokensBuilder);

    const result: vscode.SemanticTokens = tokensBuilder.build();
    wm.set(AhkFileData, result);

    return result;
}

// semantic token type
export const AhkFullSemanticHighlight: vscode.DocumentSemanticTokensProvider = {
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        return SemanticTokensCore(document);
    },
};
