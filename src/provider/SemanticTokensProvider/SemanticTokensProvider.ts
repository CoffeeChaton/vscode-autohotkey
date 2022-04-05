/* eslint-disable class-methods-use-this */
import * as path from 'path';
import * as vscode from 'vscode';
import { showTimeSpend } from '../../configUI';
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
        AhkSymbolList,
        t2,
        t1,
        DocStrMap,
        GlobalValMap,
    } = Detecter.updateDocDef(document);
    showTimeSpend(path.basename(document.uri.fsPath), t2 - t1);

    const Collector: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);
    DAList2SemanticHighlightFull(DocStrMap, AhkSymbolList, Collector);
    GlobalHighlight(GlobalValMap, Collector);
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
