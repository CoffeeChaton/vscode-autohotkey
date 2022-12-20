import * as vscode from 'vscode';
import type { DeepReadonly, TTokenStream } from '../../globalEnum';
import { getRange } from '../../tools/range/getRange';

export function getSwitchRange(
    document: vscode.TextDocument,
    DocStrMap: TTokenStream,
    textFix: string,
    line: number,
): vscode.Range | null {
    if (!(/^\s*switch[\s,]/iu).test(textFix)) return null;

    const lineFix = textFix.endsWith('{')
        ? line
        : line + 1;
    const RangeEnd = document.lineCount;
    const range = getRange(DocStrMap, lineFix, lineFix, RangeEnd);
    const PosStart = new vscode.Position(range.start.line, document.lineAt(range.start.line + 1).range.end.character);
    const PosEnd = new vscode.Position(range.end.line - 1, document.lineAt(range.end.line - 1).range.end.character);
    return new vscode.Range(PosStart, PosEnd);
}

export function inSwitchBlock(textFix: string, line: number, switchRangeArray: DeepReadonly<vscode.Range[]>): number {
    const Pos = new vscode.Position(line, 0);
    let switchDeep = 0;
    for (const sw of switchRangeArray) {
        if (sw.contains(Pos)) switchDeep++;
    }
    if (
        (/^\s*case[\s,]/iu).test(textFix)
        || (/^\s*default[\s:]/iu).test(textFix)
    ) {
        switchDeep--;
    }
    return switchDeep;
}

/*
test code
```ahk
    Switch task_set_input
    {
        Case 1:
            Task_Options := -1

        Case 2, 3:
            text := "Task_Options := 15/25..."
                . "`n" "discuss := -1 "
            Task_Options := fn_Input_Box(title, text, 0, 0)

            Switch Task_Options
            {
                Case -1, 15, 25, 35, 45, 55, 65:
                    ; nothing
                Case "Cancel":
                    Task_Options := -1
                Default :
                    ListVars
                    err_code := "--16--208--73--" A_ThisFunc
                        . "`n [ " Task_Options " ] input error "
                    fn_music_msg(err_code)
            }
            MsgBox % "you need to fix mini map!`n--43--342--81--"
            MsgBox % "use little size win !`n--39--342--82--"

        Default :
            ListVars
            err_code := "--253--274--73--" A_ThisFunc
                . "`n [ " task_set_input " ] input error "
            fn_music_msg(err_code)
    }
```
*/
