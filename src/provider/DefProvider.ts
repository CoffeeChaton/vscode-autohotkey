/* eslint max-statements: [1, 200] */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export default class DefProvider implements vscode.DefinitionProvider {
  public async provideDefinition(document: vscode.TextDocument,
    position: vscode.Position,
    // eslint-disable-next-line no-unused-vars
    token: vscode.CancellationToken)
    : Promise<vscode.Location | vscode.Location[] | vscode.LocationLink[] | null> {
    const fileLink = await this.tryGetFileLink(document, position);
    if (fileLink) {
      return fileLink;
    }
    const methodLink = await this.tryGetMethodLink(document, position);
    if (methodLink) {
      return methodLink;
    }

    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  public async tryGetFileLink(document: vscode.TextDocument, position: vscode.Position)
    : Promise<vscode.Location | null> {
    const { text } = document.lineAt(position.line);
    const includeMatch = text.match(/(?<=#include).+?\.(ahk|ext)\b/i);
    if (includeMatch) {
      const substrZero = 0;
      const parent = document.uri.path.substr(substrZero, document.uri.path.lastIndexOf('/'));
      const uri = vscode.Uri.file(includeMatch[0].trim().replace(/(%A_ScriptDir%|%A_WorkingDir%)/,
        parent));
      const PositionZero = 0;
      return new vscode.Location(uri,
        new vscode.Position(PositionZero, PositionZero));
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  public async tryGetMethodLink(document: vscode.TextDocument, position: vscode.Position)
    : Promise<vscode.Location | null> {
    const { text } = document.lineAt(position.line);
    const word = document.getText(document.getWordRangeAtPosition(position));

    //  const callReg = new RegExp(`\\b${word}\\s*\\(.*?\\)`);
    const callReg = new RegExp(`\\b${word}\\s*\\(`);
    if (!callReg.exec(text)) {
      return null;
    }
    for (const AhkFunc of await Detecter.getFuncList(document)) {
      if (AhkFunc.name.indexOf(word) !== -1) {
        return new vscode.Location(document.uri,
          new vscode.Position(AhkFunc.line, document.lineAt(AhkFunc.line).text.indexOf(word)));
      }
    }
    for (const filePath of Detecter.getCacheFile()) {
      const tempDocument = await vscode.workspace.openTextDocument(filePath);
      for (const AhkFunc of await Detecter.getFuncList(tempDocument)) {
        if (AhkFunc.name.indexOf(word) !== -1) {
          return new vscode.Location(tempDocument.uri,
            new vscode.Position(AhkFunc.line,
              tempDocument.lineAt(AhkFunc.line).text.indexOf(word)));
        }
      }
    }
    return null;
  }
}
