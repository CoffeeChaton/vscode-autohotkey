/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
import * as vscode from 'vscode';

/*
TODO wait to fix /** / block
     wait to fix ; block
     wait to fix ^\s*,
function LineTextProcess(textRawLine): string {
    const textGroup = textRawLine.split('"');
    return '\n';
}
*/
export class RangeFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const RangeText: vscode.TextEdit[] = [];
        const textRaw = document.getText(range);
        const textGroup = textRaw.split('"');
        let textNew = '';
        const iMax = textGroup.length;
        for (let i = 0; i < iMax; i += 1) {
            if (i > 0 && i < iMax) textNew += '"';
            if ((i % 2) !== 0 || textGroup[i].search(/::\s*$/) > -1 || textGroup[i].includes('`')) {
                // in ahk hotString, look like `::ts,,:: TypeScript`
                // or in ahk hotKey, look like `~F12:: func()`
                textNew += textGroup[i];
                continue;
            }

            textNew += textGroup[i].replace(/ *, */g, ', ')
                .replace(/ *:= */g, ' := ')
                .replace(/ *!= */g, ' != ')
                // .replace(/ *== */g, ' == ')
                // .replace(/ *>= */g, ' >= ')
                // .replace(/ *<= */g, ' <= ')
                .replace(/ *\.= */g, ' .= ')
                .replace(/ *\+= */g, ' += ')
                .replace(/ *-= */g, ' -= ')
                .replace(/ *\|\| */g, ' || ')
                .replace(/ *&& */g, ' && ')
                .replace(/ *<> */g, ' <> ')
                .replace(/\breturn  */g, 'return ')
                .replace(/\bReturn  */g, 'Return ') // return space+
                //    .replace(/ *\? */g, ' ? ')
                .replace(/\( */g, '(')
                .replace(/ *\)/g, ')');
            // \s === [ \f\n\r\t\v]
            // TODO more TEST & options
        }
        RangeText.push(new vscode.TextEdit(range, textNew));
        vscode.window.showInformationMessage('Format Selection is Alpha Test');
        // TODO different DIFF
        return RangeText;
    }
}
