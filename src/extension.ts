import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';
import DefProvider from './provider/DefProvider';
import { FileProvider } from './provider/FileProvider';
// import { FormatProvider } from './provider/FormatProvider';
import SymBolProvider from './provider/SymbolProvider';
import HoverProvider from './provider/HoverProvider';
import { configChangEvent, statusBarClick } from './configUI';

export function activate(context: vscode.ExtensionContext) {
    const language = { language: 'ahk' };
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath) Detecter.buildByPath(ahkRootPath);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(language, new HoverProvider()),
        vscode.languages.registerDefinitionProvider(language, new DefProvider()),
        vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
        //  vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
        FileProvider.createEditorListenr(),
        vscode.workspace.onDidChangeConfiguration(() => { configChangEvent(); }),
        vscode.commands.registerCommand('ahk.bar.click', () => { statusBarClick(); }),
    );
}

// TODO https://code.visualstudio.com/api/references/vscode-api#Diagnostic
