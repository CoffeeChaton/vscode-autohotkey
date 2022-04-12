import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { DAList2SemanticHighlightFull } from './DAList2SemanticHighlight';
import { GlobalHighlight } from './GlobalHighlight';
import { TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

function SemanticTokensCore(document: vscode.TextDocument): vscode.SemanticTokens {
    const {
        GValMap,
        DAList,
    } = Detecter.updateDocDef(document);

    const Collector: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);
    DAList2SemanticHighlightFull(DAList, Collector);
    GlobalHighlight(GValMap, Collector);
    return Collector.build();
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
