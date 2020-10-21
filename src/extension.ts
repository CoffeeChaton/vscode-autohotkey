import * as vscode from 'vscode';
// import { CompletionComma } from './provider/CompletionItemProvider';
import { Detecter } from './core/Detecter';
import { DefProvider } from './provider/Def/DefProvider';
import { FileProvider } from './provider/FileProvider';
import { FormatProvider } from './provider/Format/FormatProvider';
import { RangeFormatProvider } from './provider/FormatRange/RangeFormatProvider';
import { SymBolProvider } from './provider/SymbolProvider';
import { HoverProvider } from './provider/HoverProvider';
import { configChangEvent } from './configUI';
import { statusBarClick } from './tools/Command';
import { ReferenceProvider } from './provider/ReferenceProvider';
import { CodeActionProvider } from './provider/CodeActionProvider/CodeActionProvider';
import { CompletionItemProvider } from './provider/CompletionItem/CompletionItemProvider';

export function activate(context: vscode.ExtensionContext): void {
    const language = { language: 'ahk' };
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerCompletionItemProvider(language, new CompletionItemProvider(), ''),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerReferenceProvider(language, new ReferenceProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        vscode.languages.registerDocumentRangeFormattingEditProvider(language, new RangeFormatProvider()),
        // vscode.languages.registerRenameProvider(language, new RenameProvider()),
        vscode.languages.registerCodeActionsProvider(language, new CodeActionProvider()),
        FileProvider.createEditorListenr(),
        vscode.workspace.onDidChangeConfiguration(() => configChangEvent()),
        vscode.workspace.onDidDeleteFiles((e) => Detecter.delMap(e)),
        vscode.workspace.onDidCreateFiles((e) => Detecter.createMap(e)),
        vscode.workspace.onDidRenameFiles((e) => Detecter.renameFileName(e)),
        vscode.commands.registerCommand('ahk.bar.click', () => { statusBarClick(); }),
    );
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath) Detecter.buildByPath(false, ahkRootPath[0].uri.fsPath);
}

// TODO https://code.visualstudio.com/api/references/vscode-api#Diagnostic
// ParameterInformation
// SignatureInformation
// https://code.visualstudio.com/api/references/vscode-api#TextEditor
// if ([^\x00-\x7F] not in "" block ) auto warn
// TODO 😋 ؄. 體 体 ㅀ の Ａ Ββ Αα ❤♡ ∈ [^\x00-\x7F]
// CustomDocument
// CodeActionKind
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
            contentText: mainText ? `›${mainText}` : '',
            fontWeight: 'normal',
            fontStyle: 'normal'
        }
    }
}
*/
