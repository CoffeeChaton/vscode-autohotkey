import * as vscode from 'vscode';
import { CompletionComma } from './provider/CompletionItemProvider';
import { Detecter } from './core/Detecter';
import { DefProvider } from './provider/DefProvider';
import { FileProvider } from './provider/FileProvider';
import { FormatProvider } from './provider/FormatProvider';
import { RangeFormatProvider } from './provider/RangeFormatProvider';
// import { RenameProvider } from './provider/RenameProvider';
import { SymBolProvider } from './provider/SymbolProvider';
import { HoverProvider } from './provider/HoverProvider';
import { configChangEvent } from './configUI';
import { statusBarClick } from './tools/Command';

export function activate(context: vscode.ExtensionContext): void {
    const language = { language: 'ahk' };
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerCompletionItemProvider(language, new CompletionComma(), '.'),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        // vscode.languages.registerDocumentRangeFormattingEditProvider(language, new RangeFormatProvider()),
        // vscode.languages.registerRenameProvider(language, new RenameProvider()),
        FileProvider.createEditorListenr(),
        vscode.workspace.onDidChangeConfiguration(() => { configChangEvent(); }),
        vscode.commands.registerCommand('ahk.bar.click', () => { statusBarClick(); }),
    );
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath) Detecter.buildByPath(ahkRootPath[0].uri.fsPath);
}

// TODO https://code.visualstudio.com/api/references/vscode-api#Diagnostic
// ParameterInformation
// SignatureInformation
// https://code.visualstudio.com/api/references/vscode-api#TextEditor
// if ([^\x00-\x7F] not in "" block ) auto warn
// TODO 😋 ؄. 體 体 ㅀ の Ａ Ββ Αα ❤♡ ∈ [^\x00-\x7F]
