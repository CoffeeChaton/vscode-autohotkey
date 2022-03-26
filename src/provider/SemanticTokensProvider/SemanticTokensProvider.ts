/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { DAList2SemanticHighlightFull } from './DAList2SemanticHighlight';
import {
    TokenModifiers,
    TokenTypes,
} from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend = new vscode.SemanticTokensLegend(
    TokenTypes as unknown as string[],
    TokenModifiers as unknown as string[],
);

// core-------------------------------------
function SemanticTokensCore(document: vscode.TextDocument): vscode.SemanticTokens {
    const { AhkSymbolList } = Detecter.updateDocDef(document);

    const Collector: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    DAList2SemanticHighlightFull(document, AhkSymbolList, Collector);

    return Collector.build();
}

// semantic token type
export class AhkFullSemanticHighlight implements vscode.DocumentSemanticTokensProvider {
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    public provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        return SemanticTokensCore(document);
    }
}
