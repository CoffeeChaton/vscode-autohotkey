import * as vscode from 'vscode';
import { CAhkComment } from '../../AhkSymbol/CAhkLine';
import { EDetail } from '../../globalEnum';
import { TFuncInput } from '../getChildren';

export function getComment(FuncInput: TFuncInput): null | CAhkComment {
    const {
        line,
        lStr,
        DocStrMap,
        document,
    } = FuncInput;

    const { textRaw, detail, lineComment } = DocStrMap[line];
    if (!detail.includes(EDetail.hasDoubleSemicolon)) {
        return null;
    }

    // ;;
    if (!(/^\s*;;/u).test(textRaw)) {
        return null;
    }

    const doubleSemicolon = textRaw.indexOf(';;', lStr.length);

    const name: string = lineComment.replace(/^;;/u, '');
    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, doubleSemicolon + 2),
        new vscode.Position(line, textRaw.length),
    );
    return new CAhkComment({
        name,
        range,
        selectionRange: range,
        uri: document.uri,
    });
}
