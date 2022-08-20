import * as vscode from 'vscode';
import type { TTokenStream } from '../../../globalEnum';
import { ELTrim } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';

// https://www.autohotkey.com/docs/Scripts.htm#continuation

function getLTrimDiag(DocStrMap: TTokenStream): CDiagBase[] {
    const diag: CDiagBase[] = [];
    for (const element of DocStrMap) {
        const { LTrim } = element;
        if (LTrim === ELTrim.FlagS || LTrim === ELTrim.noFlagS) {
            // ( LTrim Join    ; Comment.
            const { textRaw, line } = element;

            const CommentCol = textRaw.indexOf(';');
            const colEd = CommentCol === -1
                ? textRaw.length
                : CommentCol;

            const waitDiagStr: string = textRaw.slice(textRaw.indexOf('(') + 1, colEd);

            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, textRaw.indexOf('(') + 1),
                new vscode.Position(line, colEd),
            );
        }
    }

    return diag;
}

// TODO check keyword options
