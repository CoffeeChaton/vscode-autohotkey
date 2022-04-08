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
    const t1: number = Date.now();
    const {
        GValMap,
        DAList,
    } = Detecter.updateDocDef(document);
    const t2: number = Date.now();
    showTimeSpend(path.basename(document.uri.fsPath), t2 - t1);

    const Collector: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);
    DAList2SemanticHighlightFull(DAList, Collector);
    GlobalHighlight(GValMap, Collector);
    return Collector.build();
}

// semantic token type
export class AhkFullSemanticHighlight implements vscode.DocumentSemanticTokensProvider {
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        return SemanticTokensCore(document);
    }
}
