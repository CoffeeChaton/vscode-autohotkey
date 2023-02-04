import * as vscode from 'vscode';
import { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import { EDetail } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';

export function ParserLabel(FuncInput: TFuncInput): CAhkLabel | null {
    if (!FuncInput.AhkTokenLine.detail.includes(EDetail.isLabelLine)) {
        return null;
    }

    const { AhkTokenLine, uri } = FuncInput;
    const { textRaw, line, lStr } = AhkTokenLine;

    /**
     * Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
     */
    const name: string = lStr.trim();
    const col: number = textRaw.search(/\S/u);

    return new CAhkLabel({
        name,
        range: getRangeOfLine(line, lStr, lStr.length),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    });
}
