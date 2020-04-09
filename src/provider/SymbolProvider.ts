/* eslint-disable class-methods-use-this */
/* eslint-disable max-statements */
/* eslint-disable no-continue */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import getSymbolEndLine from './405getSymbolEndLine';
import { trimContent, getSkipSign } from './405trimContent';
import inCommentBlock from './405inCommentBlock';

export default class SymBolProvider implements vscode.DocumentSymbolProvider {
  private showTimeSpend(document: vscode.TextDocument, timeStart: number): void {
    const name = document.uri.path.match(/([\w\s]+\.ahk|ext)$/i);
    if (name !== null) {
      const version = ''; // 'pm 10:15';
      const timeSpend = `${version} timeSpend ${Date.now() - timeStart} ms at ${name[1]}`;
      // vscode.window.showInformationMessage(timeSpend);
      vscode.window.setStatusBarMessage(timeSpend);
      //  vscode.window.showWarningMessage(timeSpend);
      // const a = vscode.window.createOutputChannel(version);
      // a.show();
      // a.appendLine(timeSpend);
      // vscode.window.showWarningMessage(timeSpend);
      // console.log(timeSpend);
    }
  }

  provideDocumentSymbols(document: vscode.TextDocument,
    // eslint-disable-next-line no-unused-vars
    _token: vscode.CancellationToken)
    : vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
    const timeStart = Date.now();
    const lineCountRule = 10000;
    const lineCount = Math.min(document.lineCount, lineCountRule);
    const result: vscode.SymbolInformation[] = [];
    let CommentBlock = false;
    let lineConsumed = 0;

    for (let line = 0; line < lineCount; line += 1) {
      const { text } = document.lineAt(line);

      CommentBlock = inCommentBlock(text, CommentBlock);
      if (CommentBlock) continue; // in /*  block

      // { ;; or ;;
      const CommentBlockSymbol = this.getCommentBlockSymbol(document, line, lineCount, text);
      if (CommentBlockSymbol) result.push(CommentBlockSymbol); // not continue

      if (lineConsumed > 0) {
        lineConsumed -= 1;
        continue;
      }

      const textFix = trimContent(text, false);
      if (textFix.trim() === '') continue; // just ''
      if (getSkipSign(textFix)) continue;

      const startPos = new vscode.Position(line, 0);
      const func = Detecter.getFuncByLine(document, line); // function
      if (func) {
        lineConsumed = func.lineConsumed;
        const funcRange = getSymbolEndLine(document, line + lineConsumed, lineCount, startPos);
        result.push(new vscode.SymbolInformation(func.name,
          vscode.SymbolKind.Method, func.Remark,
          new vscode.Location(document.uri, funcRange)));
        continue;
      }

      const BlockSymbol = this.getSymbol(document, line,
        lineCount, textFix, startPos); // class Return
      if (BlockSymbol) {
        result.push(BlockSymbol);
      }
    }
    this.showTimeSpend(document, timeStart);
    return result;
  }

  private getSymbol(document: vscode.TextDocument,
    line: number, lineCount: number,
    textFix: string, startPos: vscode.Position): vscode.SymbolInformation | null {
    const textP = textFix.trim();
    // TODO-----------------------------------------------
    const { BlockMatchList, BlockNameList, BlockKindList } = this;
    for (let i = 0; i < BlockMatchList.length; i += 1) {
      const BlockSymbol = textP.match(BlockMatchList[i]);
      if (BlockSymbol) {
        const name = `${BlockNameList[i]}${BlockSymbol[1]}`;
        const kind = BlockKindList[i];
        const Range = getSymbolEndLine(document, line, lineCount, startPos);
        return new vscode.SymbolInformation(name, kind, '',
          new vscode.Location(document.uri, Range));
      }
    }
    // TODO----------------------------------------
    const { length } = document.lineAt(line).text;
    const { oneLineMatchList, oneLineNameList, oneLineKindList } = this;
    for (let i = 0; i < oneLineMatchList.length; i += 1) {
      const BlockSymbol = textP.match(oneLineMatchList[i]);
      if (BlockSymbol) {
        const name = `${oneLineNameList[i]}${BlockSymbol[1]}`;
        const kind = oneLineKindList[i];
        const Range = new vscode.Range(startPos, new vscode.Position(line, length));
        return new vscode.SymbolInformation(name, kind, '',
          new vscode.Location(document.uri, Range));
      }
    }
    return null;
  }

  private getCommentBlockSymbol(document: vscode.TextDocument,
    line: number, lineCount: number, text: string): vscode.SymbolInformation | null {
    const kind = vscode.SymbolKind.Package;
    // TODO----------------------------------------
    // ^{;; name
    const length = 2; // length for ;;
    const CommentBlockRegex = /^\{\s\s*;;/;
    const CommentBlock = text.trim().search(CommentBlockRegex);
    if (CommentBlock > -1) {
      const name = text.substring(text.indexOf(';;') + length).trim();
      const startPos = new vscode.Position(line, 0);
      const Range = getSymbolEndLine(document, line, lineCount, startPos);
      return new vscode.SymbolInformation(name, kind, '',
        new vscode.Location(document.uri, Range));
    }
    // TODO----------------------------------------
    // ;;
    const CommentLine = text.indexOf(';;');
    if (CommentLine > -1) {
      const name = text.substring(CommentLine).trim();
      const startPos = new vscode.Position(line, CommentLine);
      const Range = new vscode.Range(startPos, new vscode.Position(line, text.length));
      return new vscode.SymbolInformation(name, kind, '',
        new vscode.Location(document.uri, Range));
    }

    return null;
  }


  private BlockMatchList: readonly RegExp[] = [
    /^class[\s,]+(\w+)/i, // class
    /^loop[\s,%]+(\w+)/i, // Loop
    /^for[\s,\w]+in\s+(\w+)/i, // For Key , Value in Expression
    /^switch\s+(\w+)/i, // Switch
  ];

  private BlockNameList: readonly string[] = [
    'Class ',
    'Loop ',
    'For ',
    'Switch ',
  ];

  private BlockKindList: readonly vscode.SymbolKind[] = [
    // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
    vscode.SymbolKind.Class,
    vscode.SymbolKind.Package,
    vscode.SymbolKind.Package,
    vscode.SymbolKind.Package,
  ];

  // ----------oneLine
  private oneLineMatchList: readonly RegExp[] = [
    /^static\b(\w*)/i, //  Static var :=
    /^return[\s,]+(.+)/i, // Return
    /^case\s+(.+):/i, // Case 8 var "str"
    /^default(\s)\s*:/i, // Default
    /^GoSub[\s,]+(\w\w*)/i, // GoSub, Label
    /^GoTo[\s,]+(\w\w*)/i, // GoTo, Label
    /^(\w+?):$/, // Label:
    /\b:=\s*new\s\s*(\w\w*)/i, //  := new
    /^:[^:]*:([^:][^:]*)::/, // HotStr
    /^([^:][^:]*)::/, // HotKeys
    /^#(\w\w*)/, // directive
    /^global[\s,][\s,]*(\w[^:]*)/i, // global , ...
    /^throw[\s,][\s,]*(.+)/i, // throw
  ];

  private oneLineNameList: readonly string[] = [
    'Static Var ',
    'Return ',
    'Case ', // TODO Case Block use switch deep
    'Default', // Default
    'GoSub ',
    'GoTo ',
    'Label ',
    'new ',
    '', // HotStr
    '', // HotKeys
    '#', // directive
    'global ',
    'Throw ',
  ];

  private oneLineKindList: readonly vscode.SymbolKind[] = [
    // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
    vscode.SymbolKind.Variable, // Static
    vscode.SymbolKind.Variable, // Return
    vscode.SymbolKind.Variable, // Case
    vscode.SymbolKind.Variable, // Default
    vscode.SymbolKind.Variable, // GoSub
    vscode.SymbolKind.Variable, // GoTo
    vscode.SymbolKind.Package, // Label
    vscode.SymbolKind.Class, // not Object  is feature
    vscode.SymbolKind.Event, // HotStr
    vscode.SymbolKind.Event, // HotKeys
    vscode.SymbolKind.Event, // directive
    vscode.SymbolKind.Variable, // Global
    vscode.SymbolKind.Event, // Throw
  ];
}
