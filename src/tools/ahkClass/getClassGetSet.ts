import { CAhkClassGetSet } from '../../AhkSymbol/CAhkClassGetSet';
import { TFuncInput } from '../../core/getChildren';
import { getRange } from '../range/getRange';
import { getRangeOfLine } from '../range/getRangeOfLine';

export function getClassGetSet(FuncInput: TFuncInput): null | CAhkClassGetSet {
    const {
        line,
        lStr,
        DocStrMap,
        RangeEndLine,
        document,
        textRaw,
    } = FuncInput;
    const lStrTrim = lStr.trim();
    if (lStrTrim.indexOf('(') !== -1 || lStrTrim.indexOf('=') !== -1) return null;

    const ma: RegExpMatchArray | null = lStrTrim.match(/^(\w+)(?:\[\])?\s*\{?$/u);
    if (ma === null) return null;

    return new CAhkClassGetSet({
        name: ma[1],
        range: getRange(DocStrMap, line, line, RangeEndLine),
        selectionRange: getRangeOfLine(line, lStr, textRaw.length),
        uri: document.uri,
    });
}

// https://www.autohotkey.com/docs/Objects.htm#Custom_Classes_property
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

//     Property[]  ; Brackets are optional ....<<< this way
//     {
//         get {
//             return ...
//         }
//         set {
//             return ... := value
//         }
//     }
// }
