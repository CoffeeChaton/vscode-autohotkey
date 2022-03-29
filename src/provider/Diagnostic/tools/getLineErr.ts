/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { TTokenStream } from '../../../globalEnum';
import { assignErr } from './lineErr/assignErr';
import { getCommandErr } from './lineErr/getCommandErr';
import { getDirectivesErr } from './lineErr/getDirectivesErr';
import { getLabelErr } from './lineErr/getLabelErr';
import { getObjBaseErr } from './lineErr/getObjBaseErr';
import { EDiagLine, TLineDiag, TLineErr } from './lineErr/lineErrTools';
import { setDiagnostic } from './setDiagnostic';

function lineErrDiag(line: number, lineErr: TLineErr): vscode.Diagnostic {
    const {
        colL,
        colR,
        value,
        severity,
        tags,
    } = lineErr;
    const range: vscode.Range = new vscode.Range(line, colL, line, colR);
    return setDiagnostic(value, range, severity, tags);
}

function getLineErrCore(lStr: string, fistWord: string): 0 | TLineErr {
    const lStrTrim: string = lStr.trim();
    if (lStrTrim === '') return 0;
    type TFnLineErr = (lStr: string, lStrTrim: string, fistWord: string) => TLineDiag;
    const fnList: TFnLineErr[] = [getDirectivesErr, getLabelErr, getObjBaseErr, getCommandErr];
    for (const fn of fnList) {
        const err: TLineDiag = fn(lStr, lStrTrim, fistWord);

        if (err === EDiagLine.OK) return 0; // OK

        if (err !== EDiagLine.miss) { // err
            return err;
        }
        // err=== EDiagLine.miss
    }
    return 0;
}

export function getLineErr(DocStrMap: TTokenStream, line: number): null | vscode.Diagnostic {
    const {
        textRaw,
        lStr,
        detail,
        fistWord,
    } = DocStrMap[line];
    const err0: TLineDiag = assignErr(textRaw, detail);
    if (err0 && err0 !== EDiagLine.OK) {
        return lineErrDiag(line, err0);
    }

    const err1: TLineErr | 0 = getLineErrCore(lStr, fistWord);

    if (err1) return lineErrDiag(line, err1);
    // err1 === 0
    return null;
}
