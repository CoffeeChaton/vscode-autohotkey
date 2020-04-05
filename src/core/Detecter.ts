/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */

/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-vars */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import trimContent from '../provider/405trimContent';

export class AhkFunc {
  constructor(public full: string, public name: string,
    public line: number, public comnent: string, public lineConsumed: number) { }
}
function getAhkMultilineFunc(document: vscode.TextDocument,
  line: number, funcName :string): AhkFunc | null {
  // https://www.autohotkey.com/docs/Scripts.htm#continuation
  // style
  // ^fn_Name( something
  // ^, something , something
  // ^, something , something
  for (let i = line; i < (line + 5); i += 1) {
    const iLine = trimContent(document.lineAt(i + 1).text, true).trim();
    if (iLine.indexOf(',') !== 0) {
      return null;
    }

    // ^, something , something ........ ) {$
    if (iLine.search(/\)\s*\{$/) > -1) {
      return new AhkFunc(funcName, funcName, line, '', i - line);
    }

    // ^, something , something ......)$
    // ^{
    if (iLine.search(/\)$/) > -1) {
      const iLine2 = trimContent(document.lineAt(i + 2).text, true).trim();
      if (iLine2.search(/^\{/) !== 0) return null; // not ^{
      return new AhkFunc(funcName, funcName, line, '', i - line + 1); // ^{
    }
  }
  return null;
}
function getAhkFuncByLine(document: vscode.TextDocument, line: number): AhkFunc | null {
  const { text } = document.lineAt(line);
  const textFix = trimContent(text, true).trim();
  if (textFix === '') return null; // just ''

  const notIF = /^if\b/i; // if | while
  if (textFix.search(notIF) > -1) return null;
  const notWhile = /^while\b/i; // if | while
  if (textFix.search(notWhile) > -1) return null;

  const fnHead = /^(\w\w*)\s*\(/;
  const fnFull = textFix.match(fnHead);
  if (fnFull === null) return null; // NOT fnHead

  const funcName = fnFull[1]; // TODO true fnFull

  // style ^fn_Name(){$
  const fnTail = /\)\s*\{$/;
  if (textFix.search(fnTail) > -1) {
    return new AhkFunc(funcName, funcName, line, '', 0);
  }

  // style
  // ^fn_Name( something something something )$
  // ^{ ...something something
  const fnTail2 = /\)$/;
  if (textFix.search(fnTail2) > -1) {
    const nextLine = trimContent(document.lineAt(line + 1).text, true).trim();
    if (nextLine.indexOf('{') !== 0) return null; // nextLine is not ^{
    return new AhkFunc(funcName, funcName, line, '', 1);
  }

  if (textFix.indexOf(')') > -1) return null;// fn_Name( something something ) something

  return getAhkMultilineFunc(document, line, funcName);
}
export class Detecter {
  private static docFuncMap = { key: String, FuncList: Array<AhkFunc>() };


  public static getCacheFile(): string[] {
    return Object.keys(this.docFuncMap).filter((key) => key.match(/\b(ahk|ext)$/i)
      && this.docFuncMap[key].length > 0);
  }

  /**
   * load method list by path
   * @param buildPath
   */
  public static async buildByPath(buildPath: string): Promise<void> {
    if (fs.statSync(buildPath).isDirectory()) {
      fs.readdir(buildPath, (err, files) => {
        if (err) {
          Out.log(err);
          return;
        }
        for (const file of files) {
          if (file.match(/(\.git|\.svn|out|target)/)) {
            continue;
          }
          this.buildByPath(`${buildPath}/${file}`);
        }
      });
    } else if (buildPath.match(/\b(ahk|ext)$/i)) {
      this.getFuncList(vscode.Uri.file(buildPath));
    }
  }

  /**
   * detect method list by document
   * @param document
   */
  public static async getFuncList(docId: vscode.TextDocument | vscode.Uri,
    usingCache = false): Promise<AhkFunc[]> {
    /*
    let document: vscode.TextDocument;
    if (docId instanceof vscode.Uri) {
      document = await vscode.workspace.openTextDocument(docId as vscode.Uri);
    } else {
      document = docId as vscode.TextDocument;
    }
    */

    const document = docId instanceof vscode.Uri
      ? await vscode.workspace.openTextDocument(docId as vscode.Uri)
      : docId as vscode.TextDocument;

    if (usingCache && this.docFuncMap[document.uri.path] !== null) {
      return this.docFuncMap[document.uri.path];
    }

    const funcList: AhkFunc[] = [];
    const lineCount = Math.min(document.lineCount, 10000);
    for (let line = 0; line < lineCount; line += 1) {
      const func = Detecter.getFuncByLine(document, line);
      if (func) {
        funcList.push(func);
      }
    }
    this.docFuncMap[document.uri.path] = funcList;
    return funcList;
  }

  public static getFuncByLine(document: vscode.TextDocument, line: number): AhkFunc | null {
    return getAhkFuncByLine(document, line);
  }

  private static getRemarkByLine(document: vscode.TextDocument, line: number) {
    if (line >= 0) {
      const { text } = document.lineAt(line);
      const markMatch = text.match(/^\s*;(.+)/);
      if (markMatch) {
        return markMatch[1];
      }
    }
    return null;
  }
}

/*
export class FileChangeProvider {

}
*/
