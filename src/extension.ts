/* eslint-disable import/no-unresolved */

import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';
import DefProvider from './provider/DefProvider';
import { FileProvider } from './provider/FileProvider';
// import { FormatProvider } from './provider/FormatProvider';
import SymBolProvider from './provider/SymbolProvider';

// eslint-disable-next-line import/prefer-default-export
export function activate(context: vscode.ExtensionContext) {
  const language = { language: 'ahk' };
  const ahkRootPath = vscode.workspace.rootPath; // TODO rootPath -->  workspaceFolders
  if (ahkRootPath) Detecter.buildByPath(ahkRootPath);

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(language, new DefProvider()),
    vscode.languages.registerDocumentSymbolProvider(language, new SymBolProvider()),
    //  vscode.languages.registerDocumentFormattingEditProvider(language, new FormatProvider()),
    FileProvider.createEditorListenr(),
  );
}


// TODO    registerColorProvider(selector: DocumentSelector,
// Provider: DocumentColor Provider): Disposable
// https://code.visualstudio.com/api/references/vscode-api#Diagnostic
// https://code.visualstudio.com/api/references/vscode-api#MessageItem
