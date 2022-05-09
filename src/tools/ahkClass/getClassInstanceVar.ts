import * as vscode from 'vscode';
import { CAhkClassInstanceVar } from '../../AhkSymbol/CAhkClass';
import { TFuncInput } from '../../core/getChildren';

export function getClassInstanceVar(FuncInput: TFuncInput): null | CAhkClassInstanceVar {
    const {
        line,
        lStr,
        textRaw,
        document,
    } = FuncInput;

    const index = lStr.indexOf(':=');
    if (index === -1) return null;

    const isStatic = (/^static\s/ui).test(lStr.trimStart());

    const realName = lStr
        .substring(0, index)
        .replace(/^\s*static\s+/ui, '')
        .trim();

    const col = lStr.lastIndexOf(realName, index);

    return new CAhkClassInstanceVar({
        showName: isStatic
            ? `Static ${realName}`
            : realName,
        realName,
        range: new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(line, textRaw.length),
        ),
        selectionRange: new vscode.Range(
            new vscode.Position(line, col),
            new vscode.Position(line, col + realName.length),
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
