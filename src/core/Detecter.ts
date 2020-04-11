/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Out } from '../common/out';
import getSymbolEndLine from '../tools/getSymbolEndLine';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
//  new vscode.SymbolInformation(name, kind, '',
//     new vscode.Location(document.uri, Range));
interface docMap {
  key: string;
  obj: vscode.SymbolInformation[] | null
}
// eslint-disable-next-line max-len
// eslint-disable-next-line import/prefer-default-export
export class Detecter {
  private static docFuncMap: docMap[] = [];

  public static getCacheFileUri(): string[] {
    const uriList: string[] = [];
    for (const fileName of this.docFuncMap) {
      if (fileName.key.match(/\b(ahk|ext)$/i)) {
        uriList.push(fileName.key);
      }
    }
    return uriList;
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
          if (file.match(/(\.git|\.svn|out|target|\.history)/)) {
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
    usingCache = false): Promise<vscode.SymbolInformation[]> {
    const document = docId instanceof vscode.Uri
      ? await vscode.workspace.openTextDocument(docId as vscode.Uri)
      : docId as vscode.TextDocument;

    const path = document.uri.fsPath;
    let i = 0;
    let funcList: vscode.SymbolInformation[] = [];
    for (const { key, obj } of this.docFuncMap) {
      if (key === path) {
        funcList = obj || [];
        break;
      }
      i += 1;
    }

    if (usingCache && funcList.length !== 0) {
      // TODO
      return funcList;
    }

    let BodyEndLine: number = 0;
    let CommentBlock = false;
    const lineCountRule = 10000;
    const lineCount = Math.min(document.lineCount, lineCountRule);
    for (let line = 0; line < lineCount; line += 1) {
      const { text } = document.lineAt(line);
      CommentBlock = inCommentBlock(text, CommentBlock);
      if (CommentBlock) continue; // in /*  block

      if (line >= BodyEndLine) {
        const func = this.getFuncByLine(document, line, lineCount);
        if (func) {
          BodyEndLine = func.location.range.end.line;
          funcList.push(func);
        }
      }
    }

    this.docFuncMap[i] = { key: path, obj: funcList };

    return funcList;
  }

  private static getRemarkByLine(document: vscode.TextDocument, line: number): string {
    if (line > 0) {
      const { text } = document.lineAt(line - 1);
      const RemarkMatch = text.match(/^\s*;@(.+)/);
      if (RemarkMatch) return RemarkMatch[1].trim();
    }
    return '';
  }

  // eslint-disable-next-line max-params
  private static getFuncByLineWrapper(startLine: number,
    document: vscode.TextDocument, lineCount: number,
    line: number, Remark: string, name: string): vscode.SymbolInformation {
    const startPos = new vscode.Position(line, 0);
    const kind = vscode.SymbolKind.Method;
    const Range = getSymbolEndLine(document, startLine, lineCount, startPos);
    return new vscode.SymbolInformation(name, kind, Remark,
      new vscode.Location(document.uri, Range));
  }

  public static getFuncByLine(document: vscode.TextDocument,
    line: number, lineCount: number): vscode.SymbolInformation | null {
    const { text } = document.lineAt(line);
    const textFix = removeSpecialChar(text, true).trim();
    if (textFix === '') return null; // just ''
    if (getSkipSign(textFix)) return null;

    const fnHeadMatch = /^(\w\w*)\(/;
    const fnHead = textFix.match(fnHeadMatch);
    if (fnHead === null) return null; // NOT fnHead

    const name = fnHead[1];
    const Remark = this.getRemarkByLine(document, line);
    // const startPos = new vscode.Position(line, 0);
    // style ^fn_Name(){$
    const fnTail = /\)\s*\{$/;
    if (textFix.search(fnTail) > -1) {
      const startLine = line + 0;// + 0
      return this.getFuncByLineWrapper(startLine, document, lineCount, line, Remark, name);
    }

    // style
    // ^fn_Name( ... )$
    // ^{ ...
    const fnTail2 = /\)$/;
    if (textFix.search(fnTail2) > -1) {
      const nextLine = removeSpecialChar(document.lineAt(line + 1).text, true).trim();
      if (nextLine.indexOf('{') !== 0) return null; // nextLine is not ^{

      const startLine = line + 1;// + 1
      return this.getFuncByLineWrapper(startLine, document, lineCount, line, Remark, name);
    }

    if (textFix.indexOf(')') > -1) return null;// fn_Name( ... ) something ,this is not ahk function
    return this.getAhkMultiRowFunc(document, line, lineCount, Remark, name);
  }

  private static getAhkMultiRowFunc(document: vscode.TextDocument,
    line: number, lineCount: number, Remark: string, name: string) {
    // ----getAhkMultiRowFunc---
    // https://www.autohotkey.com/docs/Scripts.htm#continuation
    // style
    // ^fn_Name( something
    // ^, something , something
    // ^, something , something
    const iMaxRule = 11;
    const iMax = Math.min(line + iMaxRule, lineCount);
    for (let i = line; i < iMax; i += 1) {
      const iLine = removeSpecialChar(document.lineAt(i + 1).text, true).trim();
      if (iLine.indexOf(',') !== 0) {
        return null;
      }

      // ^, something , something ........ ) {$
      if (iLine.search(/\)\s*\{$/) > -1) {
        const startLine = i;// i
        return this.getFuncByLineWrapper(startLine, document, lineCount, line, Remark, name);
      }

      // ^, something , something ......)$
      // ^{
      if (iLine.search(/\)$/) > -1) {
        // eslint-disable-next-line no-magic-numbers
        const iLine2 = removeSpecialChar(document.lineAt(i + 2).text, true).trim();
        if (iLine2.search(/^\{/) !== 0) return null; // not ^{

        const startLine = i + 1;// + 0
        return this.getFuncByLineWrapper(startLine, document, lineCount, line, Remark, name);
      }
    }
    return null;
  }
}
