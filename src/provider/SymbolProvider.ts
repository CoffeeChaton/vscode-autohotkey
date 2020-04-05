/* eslint-disable max-statements */
/* eslint-disable no-continue */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import getSymbolEndLine from './405getSymbolEndLine';
import { trimContent, getSkipSign } from './405trimContent';
import inCommentBlock from './405inCommentBlock';

function showTimeSpend(document: vscode.TextDocument, timeStart: number): void {
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
    console.log(timeSpend);
  }
}

// { ;;
function getCommentBlockSymbol(document: vscode.TextDocument,
  line: number, lineCount: number, text: string): vscode.SymbolInformation | null {
  const kind = vscode.SymbolKind.Package;
  const Length = 2; // ;; Length
  const notFind = -1;

  const CommentBlockRegex = /^\{\s\s*;;/; // ^{;; name
  const CommentBlock = text.trim().search(CommentBlockRegex);
  if (CommentBlock > notFind) { // find
    const name = text.substring(text.indexOf(';;') + Length).trim();
    const startPos = new vscode.Position(line, 0);
    const BlockRange = getSymbolEndLine(document, line, lineCount, startPos);
    return new vscode.SymbolInformation(name, kind, '',
      new vscode.Location(document.uri, BlockRange));
  }
  const DoubleComment = text.indexOf(';;'); // ;;
  if (DoubleComment > notFind) {
    const name = text.substring(DoubleComment + Length).trim();
    const startPos = new vscode.Position(line, DoubleComment);
    const endPos = new vscode.Position(line, text.length);
    return new vscode.SymbolInformation(name, kind, '',
      new vscode.Location(document.uri, new vscode.Range(startPos, endPos)));
  }

  return null;
}
// Class Loop For Switch
function getBlockSymbol(document: vscode.TextDocument,
  line: number, lineCount: number,
  textP: string, startPos: vscode.Position): vscode.SymbolInformation | null {
  const matchList: RegExp[] = [
    /^\s*class[\s,]+(\w+)/i, // class
    /^\s*loop[\s,%]+(\w+)/i, // Loop
    /^\s*for[\s,\w]+in\s+(\w+)/i, // For Key , Value in (Expression)
    /^\s*switch\s+(\w+)/i, // Switch
  ];
  const nameList: string[] = [
    'Class ',
    'Loop ',
    'For ',
    'Switch ',
  ];
  // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
  const kindList: vscode.SymbolKind[] = [
    vscode.SymbolKind.Class,
    vscode.SymbolKind.Package,
    vscode.SymbolKind.Package,
    vscode.SymbolKind.Package,
  ];

  for (let i = 0; i < matchList.length; i += 1) {
    const BlockSymbol = textP.match(matchList[i]);
    if (BlockSymbol) {
      const name = nameList[i] + BlockSymbol[1];
      const kind = kindList[i];
      const BlockRange = getSymbolEndLine(document, line, lineCount, startPos);
      return new vscode.SymbolInformation(name, kind, '',
        new vscode.Location(document.uri, BlockRange));
    }
  }
  return null;
}
// Return
function getLineSymbol(document: vscode.TextDocument, line: number,
  textFix: string, length: number, startPos: vscode.Position): vscode.SymbolInformation | null {
  const matchList: RegExp[] = [
    /^Static\b(.+)/i, //  Static var :=
    /^Return[\s,]+(.+)/i, // Return
    /^Case\s+(.+):/i, // Case 8 var "str"
    /^Default(\s)+:/i, // Default
    /^GoSub[\s,]+(\w+)/i, // GoSub, Label
    /^GoTo[\s,]+(\w+)/i, // GoTo, Label
    /^(\w+):$/, // Label:
    /:=\s*new\s\s*(.+)/i, //  := new
    /^:[^:]*:([^:]+)::/, // HotStr
    /^([^:]+)::/, // HotKeys
    /^#(\w+)/, // directive
    /^Global[\s,]+([^:]+)/i, // global
    /^Throw[\s,]+(.+)/i, // global
  ];
  const nameList: string[] = [
    'Static Var ',
    'Return ',
    'Case ', // TODO Case Block
    'Default', // Default
    'GoSub ',
    'GoTo ',
    'Label ',
    'New ',
    '', // HotStr
    '', // HotKeys
    '#', // directive
    'Global ',
    'Throw ',
  ];
  // https://code.visualstudio.com/api/references/vscode-api#SymbolKind
  const kindList: vscode.SymbolKind[] = [
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
  const textP = textFix.trim();
  for (let i = 0; i < matchList.length; i += 1) {
    const BlockSymbol = textP.match(matchList[i]);
    if (BlockSymbol) {
      const name = nameList[i] + BlockSymbol[1];
      const kind = kindList[i];
      //
      const endPos = new vscode.Position(line, length);
      const LineRange = new vscode.Range(startPos, endPos);
      //
      const LineLocation = new vscode.Location(document.uri, LineRange);
      return new vscode.SymbolInformation(name, kind, '', LineLocation);
    }
  }
  return null;
}

export default class SymBolProvider implements vscode.DocumentSymbolProvider {
  // eslint-disable-next-line class-methods-use-this
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
      const CommentBlockSymbol = getCommentBlockSymbol(document, line, lineCount, text);
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

      const BlockSymbol = getBlockSymbol(document, line, lineCount, textFix, startPos); // class
      if (BlockSymbol) {
        result.push(BlockSymbol);
        continue;
      }

      const { length } = text;
      const LineSymbol = getLineSymbol(document, line, textFix, length, startPos); // Return
      if (LineSymbol) {
        result.push(LineSymbol);
        continue;
      }
    }
    showTimeSpend(document, timeStart);
    return result;
  }
}
