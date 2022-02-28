import * as vscode from 'vscode';
import { openDocs, statusBarClick } from './command/Command';
import { UpdateCache } from './command/UpdateCache';
import { configChangEvent } from './configUI';
import { Detecter } from './core/Detecter';
import { diagColl } from './core/diag/diagRoot';
import { onClosetDocClearDiag } from './core/diag/onClosetDocClearDiag';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';
import { NekoDebugMain } from './provider/debugger/NekoDebugMain';
import { DefProvider } from './provider/Def/DefProvider';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { OnTypeFormattingEditProvider } from './provider/FormattingEditOnType/OnTypeFormattingEditProvider';
import { HoverProvider } from './provider/Hover/HoverProvider';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { RenameProvider } from './provider/Rename/RenameProvider';
import { SymBolProvider } from './provider/SymbolProvider';

export function activate(context: vscode.ExtensionContext): void {
    const language: vscode.DocumentSelector = { language: 'ahk' };
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(language, new CodeActionProvider()),
        vscode.languages.registerCompletionItemProvider(language, new CompletionItemProvider(), '', '.', '{'),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        vscode.languages.registerDocumentRangeFormattingEditProvider(language, new RangeFormatProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerOnTypeFormattingEditProvider(language, new OnTypeFormattingEditProvider(), '\n'),
        vscode.languages.registerReferenceProvider(language, new ReferenceProvider()),
        vscode.languages.registerRenameProvider(language, new RenameProvider()),
        // vscode.languages.registerSignatureHelpProvider(language, new SignatureHelpProvider(), '(', ')', ','),
        vscode.workspace.onDidChangeConfiguration((): void => configChangEvent()),
        vscode.workspace.onDidDeleteFiles((e): void => Detecter.delMap(e)),
        vscode.workspace.onDidCreateFiles((e): void => Detecter.createMap(e)),
        vscode.workspace.onDidRenameFiles((e): void => Detecter.renameFileName(e)), // just support rename, not support Move
        vscode.workspace.onDidCloseTextDocument((document: vscode.TextDocument): void => {
            void onClosetDocClearDiag(document.uri.fsPath);
        }),
        // vscode.workspace.onDidChangeTextDocument((e) => d(e)),
        vscode.commands.registerCommand('ahk.bar.click', (): void => void statusBarClick()),
        vscode.commands.registerCommand('ahk.nekoHelp.openDoc', (): void => void openDocs()),
        vscode.debug.registerDebugAdapterDescriptorFactory('ahk', new NekoDebugMain()),
    );
    UpdateCache();
}

export function deactive(): void {
    Detecter.DocMap.clear();
    diagColl.clear();
}

/*
https://github.com/think2011/vscode-i18n-core/blob/10abc4b356cfb34f64d17a7dbdb73e58f6bd6274/editor/Annotation.ts

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
// createTextEditorDecorationType
QuickInput
*/
