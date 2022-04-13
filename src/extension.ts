import {
    commands,
    debug,
    DocumentSelector,
    ExtensionContext,
    languages,
    workspace,
} from 'vscode';
import { openDocs, statusBarClick } from './command/Command';
import { UpdateCacheAsync } from './command/UpdateCache';
import { configChangEvent, statusBarItem } from './configUI';
import { BaseScanMemo } from './core/BaseScanMemo/memo';
import { Detecter, diagColl } from './core/Detecter';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { AhkCodeLens, ECommand } from './provider/CodeLens/CodeLensProvider';
import { showFuncAnalyze } from './provider/CodeLens/showFuncAnalyze';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { NekoDebugMain } from './provider/debugger/NekoDebugMain';
import { DefProvider } from './provider/Def/DefProvider';
import { ahkOnDidCloseTextDoc } from './provider/event/ahkOnDidCloseTextDoc';
import { ahkRenameFiles } from './provider/event/ahkRenameFiles';
import { FoldingRangeProvider } from './provider/FoldingRange/FoldingRangeProvider';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/Hover/HoverProvider';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { AhkFullSemanticHighlight, legend } from './provider/SemanticTokensProvider/SemanticTokensProvider';
import { SymBolProvider } from './provider/SymbolProvider/SymbolProvider';
import { OutputChannel } from './provider/vscWindows/OutputChannel';
import { WorkspaceSymbolProvider } from './provider/WorkspaceSymbolProvider/WorkspaceSymbolProvider';

// main
export function activate(context: ExtensionContext): void {
    const selector: DocumentSelector = { language: 'ahk' };
    context.subscriptions.push(
        // languages-------------------
        languages.registerCodeActionsProvider(selector, CodeActionProvider),
        languages.registerCodeLensProvider(selector, AhkCodeLens),
        languages.registerCompletionItemProvider(selector, CompletionItemProvider, 'A_', '', '.', '{'),
        languages.registerDefinitionProvider(selector, DefProvider),
        languages.registerDocumentFormattingEditProvider(selector, FormatProvider),
        languages.registerDocumentRangeFormattingEditProvider(selector, RangeFormatProvider),
        languages.registerDocumentSemanticTokensProvider(selector, AhkFullSemanticHighlight, legend),
        languages.registerDocumentSymbolProvider(selector, SymBolProvider),
        languages.registerFoldingRangeProvider(selector, FoldingRangeProvider),
        languages.registerHoverProvider(selector, HoverProvider),
        languages.registerOnTypeFormattingEditProvider(selector, OnTypeFormattingEditProvider, '\n'),
        languages.registerReferenceProvider(selector, ReferenceProvider),
        languages.registerRenameProvider(selector, RenameProvider),
        languages.registerWorkspaceSymbolProvider(WorkspaceSymbolProvider),
        // workspace-------------------
        workspace.onDidChangeConfiguration((): void => configChangEvent()),
        workspace.onDidCloseTextDocument(ahkOnDidCloseTextDoc),
        workspace.onDidCreateFiles((e): void => Detecter.createMap(e)),
        workspace.onDidDeleteFiles((e): void => Detecter.delMap(e)),
        workspace.onDidRenameFiles(ahkRenameFiles),
        // workspace.onDidChangeTextDocument((e) => d(e)),
        // workspace.registerTextDocumentContentProvider(selector, e),
        // commands--------------------
        commands.registerCommand('ahk.bar.click', (): void => void statusBarClick()),
        commands.registerCommand('ahk.nekoHelp.openDoc', (): void => openDocs()),
        commands.registerCommand(ECommand.ShowFuncAnalyze, showFuncAnalyze),
        // debug
        debug.registerDebugAdapterDescriptorFactory('ahk', NekoDebugMain),
        // root dispose
        OutputChannel,
        statusBarItem,
        diagColl,
    );
    //
    void UpdateCacheAsync(true); // not await
}

// this method is called when your extension is deactivated
export function deactive(): void {
    Detecter.DocMap.clear();
    BaseScanMemo.memo.clear();
}

// TODO i18n of diag
/*
https://github.com/microsoft/vscode-extension-samples/tree/main/i18n-sample

createTextEditorDecorationType
vscode.Progress

registerTextDocumentContentProvider
registerSignatureHelpProvider(language, new SignatureHelpProvider(), '(', ')', ','),

CodeLensProvider -> run this func/command DA
FoldingRangeProvider
*/
