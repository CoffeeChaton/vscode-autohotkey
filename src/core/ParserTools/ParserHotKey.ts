import * as vscode from 'vscode';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkLine';

import { EDetail } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';

/**
 * ```ahk
 * ~F10::
 *     MsgBox % "text"
 * Return
 *
 * ~F11:: foo()
 *
 * ;https://www.autohotkey.com/docs/v1/Hotkeys.htm#Function
 * ~F1::
 * ~F2::
 *     boo(){
 *     }
 * ```
 *
 *  - <https://www.autohotkey.com/docs/v1/Hotkeys.htm>
 *  - Hotkey labels consist of a hotkey followed by double-colon.
 */
export function ParserHotKey(FuncInput: TFuncInput): CAhkHotKeys | null {
    const { AhkTokenLine, uri } = FuncInput;
    const {
        textRaw,
        line,
        lStr,
        detail,
    } = AhkTokenLine;

    if (detail.includes(EDetail.isHotStrLine) || detail.includes(EDetail.isLabelLine)) {
        return null;
    }

    const ma: RegExpMatchArray | null = lStr.match(/^([^:]+::)/u);
    if (ma === null) return null;

    const name: string = ma[1].trim();
    const col: number = lStr.search(/\S/u);

    return new CAhkHotKeys({
        name,
        range: getRangeOfLine(line, lStr, textRaw.length),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri,
        AhkTokenLine,
    });
}
