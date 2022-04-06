import * as vscode from 'vscode';
import { getChildren, TFuncInput } from '../../core/getChildren';
import { TAhkSymbol } from '../../globalEnum';
import { getRange } from '../range/getRange';

function getName(FuncInput: TFuncInput): string | null {
    const {
        line,
        lStr,
        DocStrMap,
        RangeEndLine,
    } = FuncInput;
    const lStrTrim = lStr.trim();
    const exec = (/\w+/u).exec(lStrTrim);
    if (exec === null) return null;
    if (lStrTrim.endsWith('{')) return exec[0];

    if ((line + 1 < RangeEndLine) && DocStrMap[line + 1]) {
        const nextLStr = DocStrMap[line + 1].lStr.trim();
        if (nextLStr.startsWith('{')) return exec[0];
    }
    return null;
}

export function getClassGetSet(FuncInput: TFuncInput): null | TAhkSymbol {
    const {
        line,
        lStr,
        DocStrMap,
        RangeEndLine,
        GValMap,
    } = FuncInput;
    if (lStr.indexOf('(') !== -1 || lStr.indexOf('=') !== -1) return null;

    if (!(/^\s*\w+(?:\[\])?\s*\{?\s*$/u).test(lStr)) return null;
    const name: string | null = getName(FuncInput);
    if (name === null) return null;

    const range = getRange(DocStrMap, line, line, RangeEndLine);
    const detail = '';
    const kind = vscode.SymbolKind.Property;
    const selectionRange = range;
    const classSymbol: TAhkSymbol = new vscode.DocumentSymbol(name, detail, kind, range, selectionRange);
    classSymbol.children = getChildren({
        DocStrMap,
        RangeStartLine: range.start.line + 1,
        RangeEndLine: range.end.line,
        inClass: true,
        fnList: [getClassGetSet],
        GValMap,
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
