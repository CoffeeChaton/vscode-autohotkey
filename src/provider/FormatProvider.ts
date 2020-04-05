/* eslint-disable no-restricted-syntax */
/* eslint-disable init-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
/* eslint-disable no-continue */
/* eslint complexity: ["error", 30] */
/* eslint max-statements: [1, 200] */
// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
  const lastLineId = document.lineCount - 1;
  return new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

function trimContent(text: string) {
  let textFix = text;
  const comment = textFix.indexOf(';');
  if (comment !== -1) {
    textFix = textFix.substring(0, comment);
  }

  const msgbox = textFix.indexOf('msgbox');
  if (msgbox !== -1) {
    textFix = `${textFix.substring(0, msgbox)}mb`;
  }

  const gui = textFix.match(/gui[\s|,]/);
  if (gui !== null) {
    textFix = textFix.substring(0, textFix.indexOf('gui'));
  }

  return textFix;
}

// eslint-disable-next-line import/prefer-default-export
export class FormatProvider implements vscode.DocumentFormattingEditProvider {
  private static oneCommandList = ['ifnotexist', 'ifexist', 'ifwinactive', 'ifwinnotactive', 'ifwinexist', 'ifwinnotexist', 'ifinstring', 'ifnotinstring', 'if', 'else', 'loop', 'for', 'while', 'catch'];

  // eslint-disable-next-line class-methods-use-this
  public provideDocumentFormattingEdits(document: vscode.TextDocument,
    _options: vscode.FormattingOptions,
    _token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    let formatDocument = '';
    let deep = 0;
    // const tagDeep = 0;
    let oneCommandCode = false;

    for (let line = 0; line < document.lineCount; line += 1) {
      let notDeep = true;
      let { text } = document.lineAt(line);
      text = text.toLowerCase();
      text = trimContent(text);
      /*
      if (text.match(/#ifwinactive$/) || text.match(/#ifwinnotactive$/) || (text.match(/\breturn\b/) && tagDeep === deep)) {
        deep -= 1;
        notDeep = false;
      }
      */
      const blockEnd = text.match(/}/);
      if (blockEnd !== null) {
        let temp = blockEnd.length;
        const t2 = text.match(/{[^{}]*}/);
        if (t2) {
          temp -= t2.length;
        }
        deep -= temp;
        if (temp > 0) {
          notDeep = false;
        }
      }
      /*
      if (text.match(/:$/)) {
        if (tagDeep > 0 && tagDeep === deep) {
          deep -= 1;
          notDeep = false;
        }
      }
      */
      if (oneCommandCode && text.match(/{/) !== null) {
        const blockEnd2 = text.match(/}/);
        if (blockEnd2) {
          let temp = blockEnd2.length;
          const t2 = text.match(/{[^{}]*}/);
          if (t2) {
            temp -= t2.length;
          }
          if (temp > 0) {
            oneCommandCode = false;
            deep -= 1;
          }
        }
      }

      if (deep < 0) {
        deep = 0;
      }
      formatDocument += (' '.repeat(deep * 4) + document.lineAt(line).text.replace(/ {2,}/g, ' ').replace(/^\s*/, ''));
      if (line !== document.lineCount - 1) {
        formatDocument += '\n';
      }

      if (oneCommandCode) {
        oneCommandCode = false;
        deep -= 1;
      }
      /*
      if (text.match(/#ifwinactive.*?\s/) || text.match(/#ifwinnotactive.*?\s/)) {
        deep += 1;
        notDeep = false;
      }
      */
      const blockStart = text.match(/{/);
      if (blockStart !== null) {
        let temp = blockStart.length;
        const t2 = text.match(/{[^{}]*}/);
        if (t2) {
          temp -= t2.length;
        }
        deep += temp;
        if (temp > 0) {
          notDeep = false;
        }
      }
      /*
      if (text.match(/:$/)) {
        deep += 1;
        tagDeep = deep;
        notDeep = false;
      }
      */
      if (notDeep) {
        for (const oneCommand of FormatProvider.oneCommandList) {
          const temp = new RegExp(`\\b${oneCommand}\\b(.*)`).exec(text);
          if (temp !== null && !temp[1].includes('/')) {
            oneCommandCode = true;
            deep += 1;
            break;
          }
        }
      }
    }
    const result: vscode.TextEdit[] = [];
    result.push(new vscode.TextEdit(fullDocumentRange(document), formatDocument.replace(/\n{2,}/g, '\n\n')));
    return result;
  }
}
