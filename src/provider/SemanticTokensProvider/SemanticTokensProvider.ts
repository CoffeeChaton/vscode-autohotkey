import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { DAList2SemanticHighlight } from './DAList2SemanticHighlight';
import { funcHighlight } from './funcHighlight';
import { ModuleVarSemantic } from './ModuleVarSemantic';
import { MultilineHighlight } from './MultilineHighlight';
import { pushToken, TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

const wm = new WeakMap<TAhkFileData, vscode.SemanticTokens>();

function SemanticTokensCore(document: vscode.TextDocument): vscode.SemanticTokens | null {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const cache: vscode.SemanticTokens | undefined = wm.get(AhkFileData);
    if (cache !== undefined) return cache;

    const { AST, ModuleVar, DocStrMap } = AhkFileData;

    const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    pushToken([
        ...DAList2SemanticHighlight(AST),
        ...ModuleVarSemantic(ModuleVar),
        ...funcHighlight(DocStrMap),
        ...MultilineHighlight(DocStrMap),
    ], tokensBuilder);

    const SemanticTokens: vscode.SemanticTokens = tokensBuilder.build();
    wm.set(AhkFileData, SemanticTokens);

    return SemanticTokens;
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
