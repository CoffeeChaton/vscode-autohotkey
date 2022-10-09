import * as path from 'node:path';
import * as vscode from 'vscode';
import { showTimeSpend } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { DAList2SemanticHighlight } from './DAList2SemanticHighlight';
import { GlobalHighlight } from './GlobalHighlight';
import { ModuleVarSemantic } from './ModuleVarSemantic';
import { pushToken, TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

const wm = new WeakMap<TAhkFileData, vscode.SemanticTokens>();

function SemanticTokensCore(document: vscode.TextDocument): vscode.SemanticTokens {
    const AhkFileData: TAhkFileData = pm.updateDocDef(document);
    showTimeSpend(path.basename(document.uri.fsPath));
    const cache: vscode.SemanticTokens | undefined = wm.get(AhkFileData);
    if (cache !== undefined) return cache;

    const {
        GValMap,
        AST,
        ModuleVar,
    } = AhkFileData;

    const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    pushToken([
        ...DAList2SemanticHighlight(AST),
        ...GlobalHighlight(GValMap),
        ...ModuleVarSemantic(ModuleVar),
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
