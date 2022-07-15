import * as vscode from 'vscode';
import { CAhkClassInstanceVar } from '../../AhkSymbol/CAhkClass';
import type { TFuncInput } from '../../core/getChildren';

export function getClassInstanceVar(FuncInput: TFuncInput): CAhkClassInstanceVar | null {
    const {
        line,
        lStr,
        textRaw,
        document,
    } = FuncInput;

    const index = lStr.indexOf(':=');
    if (index === -1) return null;

    const isStatic = (/^static\s/ui).test(lStr.trimStart());

    const name = lStr
        .slice(0, index)
        .replace(/^\s*static\s+/ui, '')
        .trim();

    const col = lStr.lastIndexOf(name, index);

    return new CAhkClassInstanceVar({
        name,
        range: new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(line, textRaw.length),
        ),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + name.length),
        ),
        uri: document.uri,
        detail: isStatic
            ? 'static ClassVar'
            : 'Instance Var',
        isStatic,
    });
}

// https://www.autohotkey.com/docs/Objects.htm#Custom_Classes

// class ClassName extends BaseClassName
// {
//     InstanceVar := Expression
//     static ClassVar := Expression
// }
