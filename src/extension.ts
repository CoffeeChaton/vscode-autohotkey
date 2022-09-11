import type { DocumentSelector, ExtensionContext } from 'vscode';
import {
    commands,
    languages,
    window,
    workspace,
} from 'vscode';
import { AnalyzeFuncMain } from './command/AnalyzeFunc/AnalyzeThisFunc';
import { statusBarClick } from './command/Command';
import { ECommand } from './command/ECommand';
import { ListAllFuncMain } from './command/ListAllFunc';
import { ListAllInclude } from './command/ListAllInclude';
import { ListIncludeTree } from './command/ListIncludeTree';
import { UpdateCacheAsync, UpdateCacheUi } from './command/UpdateCache';
import { configChangEvent, statusBarItem } from './configUI';
import { diagColl, pm } from './core/ProjectManager';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CodeLensProvider } from './provider/CodeLens/CodeLensProvider';
import { showUnknownAnalyze } from './provider/CodeLens/showUnknownAnalyze';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { DefProvider } from './provider/Def/DefProvider';
import { onDidChangeActiveTab, onDidChangeTabs } from './provider/event/onDidChangeTabs';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/Hover/HoverProvider';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { AhkFullSemanticHighlight, legend } from './provider/SemanticTokensProvider/SemanticTokensProvider';
import { SymbolProvider } from './provider/SymbolProvider/SymbolProvider';
import { OutputChannel } from './provider/vscWindows/OutputChannel';
import { WorkspaceSymbolProvider } from './provider/WorkspaceSymbolProvider/WorkspaceSymbolProvider';

// main
export function activate(context: ExtensionContext): void {
    const selector: DocumentSelector = { language: 'ahk' };
    context.subscriptions.push(
        // languages-------------------
        languages.registerCodeActionsProvider(selector, CodeActionProvider),
        languages.registerCodeLensProvider(selector, CodeLensProvider),
        languages.registerCompletionItemProvider(selector, CompletionItemProvider, '', '.', '{', '#', '_'),
        languages.registerDefinitionProvider(selector, DefProvider),
        languages.registerDocumentFormattingEditProvider(selector, FormatProvider),
        languages.registerDocumentRangeFormattingEditProvider(selector, RangeFormatProvider),
        languages.registerDocumentSemanticTokensProvider(selector, AhkFullSemanticHighlight, legend),
        languages.registerDocumentSymbolProvider(selector, SymbolProvider),
        languages.registerHoverProvider(selector, HoverProvider),
        languages.registerOnTypeFormattingEditProvider(selector, OnTypeFormattingEditProvider, '\n'),
        languages.registerReferenceProvider(selector, ReferenceProvider),
        languages.registerRenameProvider(selector, RenameProvider),
        languages.registerWorkspaceSymbolProvider(WorkspaceSymbolProvider),
        // workspace-------------------
        // workspace.onDidChangeTextDocument(pm.changeDoc),
        // workspace.onDidOpenTextDocument(pm.OpenFile),
        // workspace.onDidSaveTextDocument(pm.OnDidSaveTextDocument),
        // workspace.registerTextDocumentContentProvider(selector, e),
        workspace.onDidChangeConfiguration(configChangEvent),
        workspace.onDidCreateFiles(pm.createMap),
        workspace.onDidDeleteFiles(pm.delMap),
        workspace.onDidRenameFiles(pm.renameFiles),
        // window----------------------
        // window.onDidChangeVisibleTextEditors(onChangeVisibleTabs),
        // window.tabGroups.onDidChangeTabGroups(onDidChangeTabGroups),
        window.onDidChangeActiveTextEditor(onDidChangeActiveTab),
        window.tabGroups.onDidChangeTabs(onDidChangeTabs),
        // commands--------------------
        commands.registerCommand('ahk.nekoHelp.bar', statusBarClick),
        commands.registerCommand('ahk.nekoHelp.refreshResource', UpdateCacheUi),
        commands.registerCommand(ECommand.ListAllFunc, ListAllFuncMain),
        commands.registerCommand(ECommand.ListAllInclude, ListAllInclude),
        commands.registerCommand(ECommand.ListIncludeTree, ListIncludeTree),
        commands.registerCommand(ECommand.showFuncAnalyze, AnalyzeFuncMain),
        commands.registerCommand(ECommand.showUnknownAnalyze, showUnknownAnalyze),
        // root dispose
        OutputChannel,
        statusBarItem,
        diagColl,
    );
    //
    void commands.executeCommand('setContext', 'AhkNekoHelpExtension.showMyCommand', true);
    void UpdateCacheAsync(true); // not await
}

// this method is called when your extension is deactivated
export function deactive(): void {
    // none
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
// TODO %A_ScriptDir%\Lib\  ; Local library - requires [v1.0.90+].
//      %A_MyDocuments%\AutoHotkey\Lib\  ; User library.
//      directory-of-the-currently-running-AutoHotkey.exe\Lib\  ; Standard library.
