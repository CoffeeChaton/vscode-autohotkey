import * as vscode from 'vscode';
import { FuncInputType, getChildren } from '../../core/getChildren';
import { MyDocSymbol } from '../../globalEnum';
import { getRange } from '../getRange';

function getName(FuncInput: FuncInputType): string | false {
    const {
        line, lStr, DocStrMap, RangeEndLine,
    } = FuncInput;
    const lStrTrim = lStr.trim();
    const exec = (/\w\w*/).exec(lStrTrim);
    if (exec === null) return false;
    if (lStrTrim.endsWith('{')) return exec[0];

    if ((line + 1 < RangeEndLine) && DocStrMap[line + 1]) {
        const nextLStr = DocStrMap[line + 1].lStr.trim();
        if (nextLStr.startsWith('{')) return exec[0];
    }
    return false;
}
export function getClassGetSet(FuncInput: FuncInputType): false | MyDocSymbol {
    const {
        Uri, line, lStr, DocStrMap, RangeEndLine,
    } = FuncInput;
    if (lStr.indexOf('(') !== -1 || lStr.indexOf('=') !== -1) return false;

    if (!(/^\s*\w\w*(?:\[\\])?\s*{?\s*$/).test(lStr)) return false;
    const name = getName(FuncInput);
    if (name === false) return false;

    const range = getRange(DocStrMap, line, line, RangeEndLine);
    return {
        name,
        detail: '',
        kind: vscode.SymbolKind.Property,
        range,
        selectionRange: range,
        children: getChildren({
            Uri,
            DocStrMap,
            RangeStartLine: range.start.line + 1,
            RangeEndLine: range.end.line,
            inClass: true,
            fnList: [getClassGetSet],
        }),
    };
}
//  https://www.autohotkey.com/docs/Objects.htm#Dynamic_Properties
// class ClassName extends BaseClassName
// {
//     InstanceVar := Expression
//     static ClassVar := Expression

//     class NestedClass
//     {
//         ...
//     }

//     Method()
//     {
//         ...
//     }

//     Property[]  ; Brackets are optional
//     {
//         get {
//             return ...
//         }
//         set {
//             return ... := value
//         }
//     }
// }
