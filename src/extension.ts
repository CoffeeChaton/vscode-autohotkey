import * as vscode from 'vscode';
import { openDocs, statusBarClick } from './command/Command';
import { UpdateCacheAsync } from './command/UpdateCache';
import { configChangEvent } from './configUI';
import { BaseScanCache } from './core/BaseScanCache/cache';
import { Detecter } from './core/Detecter';
import { diagColl } from './core/diagRoot';
import { globalValMap } from './core/Global';
import { FileSystemWatcher } from './FileSystemWatcher';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { NekoDebugMain } from './provider/debugger/NekoDebugMain';
import { DefProvider } from './provider/Def/DefProvider';
import { onClosetDocClearDiag } from './provider/event/onClosetDocClearDiag';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/Hover/HoverProvider';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { SymBolProvider } from './provider/SymbolProvider/SymbolProvider';

export function activate(context: vscode.ExtensionContext): void {
    const language: vscode.DocumentSelector = { language: 'ahk' };
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(language, new CodeActionProvider()),
        vscode.languages.registerCompletionItemProvider(language, new CompletionItemProvider(), 'A_', '', '.', '{'),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        vscode.languages.registerDocumentRangeFormattingEditProvider(language, new RangeFormatProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerOnTypeFormattingEditProvider(language, new OnTypeFormattingEditProvider(), '\n'),
        vscode.languages.registerReferenceProvider(language, new ReferenceProvider()),
        vscode.languages.registerRenameProvider(language, new RenameProvider()),
        // TODO registerTextDocumentContentProvider
        // vscode.languages.registerSignatureHelpProvider(language, new SignatureHelpProvider(), '(', ')', ','),
        vscode.workspace.onDidChangeConfiguration((): void => configChangEvent()),
        vscode.workspace.onDidDeleteFiles((e): void => Detecter.delMap(e)),
        vscode.workspace.onDidCreateFiles((e): void => Detecter.createMap(e)),
        vscode.workspace.onDidRenameFiles((e): void => Detecter.renameFileName(e)), // just support rename, not support Move
        // vscode.workspace.onDidChangeTextDocument((e) => d(e)),
        vscode.workspace.onDidCloseTextDocument((doc: vscode.TextDocument): void => {
            void onClosetDocClearDiag(doc.uri.fsPath);
        }),
        vscode.commands.registerCommand('ahk.bar.click', (): void => void statusBarClick()),
        vscode.commands.registerCommand('ahk.nekoHelp.openDoc', (): void => openDocs()),
        vscode.debug.registerDebugAdapterDescriptorFactory('ahk', new NekoDebugMain()),
        FileSystemWatcher,
    );
    void UpdateCacheAsync(false); // not await
}

export function deactive(): void {
    Detecter.DocMap.clear();
    BaseScanCache.cache.clear();
    globalValMap.clear();
    diagColl.clear();
}

/*
TODO i18n
https://github.com/think2011/vscode-i18n-core/blob/10abc4b356cfb34f64d17a7dbdb73e58f6bd6274/editor/Annotation.ts
https://github.com/microsoft/vscode-extension-samples/tree/main/i18n-sample

const range: vscode.Range = new vscode.Range(
    document.positionAt(index),
    document.positionAt(index + matchKey.length + 1)
)

const decoration = {
    range,
    renderOptions: {
        after: {
            color: 'rgba(150, 150, 150, 0.7)',
            contentText: mainText ? `${mainText}` : '',
            fontWeight: 'normal',
            fontStyle: 'normal'
        }
    }
}
vscode.Progress
TODO createTextEditorDecorationType
*/
