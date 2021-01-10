import * as vscode from 'vscode';
import { FuncInputType, getChildren } from '../../core/getChildren';
import { TAhkSymbol } from '../../globalEnum';
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
export function getClassGetSet(FuncInput: FuncInputType): false | TAhkSymbol {
    const {
        gValMapBySelf, Uri, line, lStr, DocStrMap, RangeEndLine,
    } = FuncInput;
    if (lStr.indexOf('(') !== -1 || lStr.indexOf('=') !== -1) return false;

    if (!(/^\s*\w\w*(?:\[\\])?\s*{?\s*$/).test(lStr)) return false;
    const name = getName(FuncInput);
    if (name === false) return false;

    const range = getRange(DocStrMap, line, line, RangeEndLine);
    const detail = '';
    const kind = vscode.SymbolKind.Property;
    const selectionRange = range;
    const classSymbol: TAhkSymbol = new vscode.DocumentSymbol(name, detail, kind, range, selectionRange);
    // eslint-disable-next-line immutable/no-mutation
    classSymbol.children = getChildren({
        gValMapBySelf,
        Uri,
        DocStrMap,
        RangeStartLine: range.start.line + 1,
        RangeEndLine: range.end.line,
        inClass: true,
        fnList: [getClassGetSet],
    });
    return classSymbol;
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
