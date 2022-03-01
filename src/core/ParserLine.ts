/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { isPerformanceMode } from '../configUI';
import { DeepReadonly, TAhkSymbol } from '../globalEnum';
import { getRangeOfLine } from '../tools/getRangeOfLine';
// import { removeBigParentheses } from '../tools/removeBigParentheses';
// import { removeParentheses } from '../tools/removeParentheses';
import { FuncInputType } from './getChildren';
import { setGlobalVar } from './setGlobalVar';

type LineRulerType = DeepReadonly<{
    detail: string;
    kind: vscode.SymbolKind;
    // regex?: RegExp,
    test: (str: string) => boolean;
    getName: (str: string) => string | null;
}>;

const IncludeAgain = {
    detail: '#IncludeAgain',
    kind: vscode.SymbolKind.Event,
    getName(str: string): string | null {
        const e = (/^\s*#IncludeAgain\s+(\S+)[\s|$]/ui).exec(str);
        return e
            ? `#IncludeAgain ${e[1]}`
            : null;
    },

    test(str: string): boolean {
        return (/^\s*#IncludeAgain\b/iu).test(str);
    },
};

const Include = {
    detail: '#Include',
    kind: vscode.SymbolKind.Event,
    getName(str: string): string | null {
        const e = (/^\s*#Include\s+(\S+)[\s|$]/iu).exec(str);
        return e
            ? `#Include ${e[1]}`
            : null;
    },

    test(str: string): boolean {
        return (/^\s*#Include\b/iu).test(str);
    },
};

const directive = {
    detail: 'directive',
    kind: vscode.SymbolKind.Event,
    getName(str: string): string | null {
        const e = (/^\s*(#\w+)/u).exec(str);
        return e
            ? e[1]
            : null;
    },

    test(str: string): boolean {
        return (/^\s*#/u).test(str);
    },
};

// const ahkStatic = {
//     detail: 'static',
//     kind: vscode.SymbolKind.Variable,
//     getName(str: string): string | null {
//         return removeParentheses(removeBigParentheses(str.replace(/^\s*\bstatic\b[\s,]/iu, '')))
//             .split(',')
//             .map((v) => {
//                 const col = v.indexOf(':=');
//                 return (col > 0)
//                     ? v.substring(0, col).trim()
//                     : v;
//             })
//             .join(', ')
//             .trim();
//     },

//     test(str: string): boolean {
//         return (/^\s*\bstatic\b[\s,]/iu).test(str);
//     },
// };

// const ahkThrow = {
//     detail: 'throw',
//     kind: vscode.SymbolKind.Event,
//     getName(str: string): string | null {
//         const e = (/^\s*\bthrow\b[\s,]+(.+)/iu).exec(str);
//         return e
//             ? `throw ${e[1]}`
//             : null;
//     },

//     test(str: string): boolean {
//         return (/^\s*\bthrow\b/iu).test(str);
//     },
// };

const ahkLabel = {
    detail: 'label',
    kind: vscode.SymbolKind.Package,
    getName(str: string): string | null {
        const e = (/^\s*(\w+:)\s*$/u).exec(str);
        return e
            ? e[1]
            : null;
    },

    test(str: string): boolean {
        return (/^\s*\w+:\s*$/u).test(str);
    },
};

const HotString = {
    // HotStr
    detail: 'HotString',
    kind: vscode.SymbolKind.Event,
    getName(str: string): string | null {
        const e = (/^\s*(:[^:]*?:[^:]+::)/u).exec(str);
        return e
            ? e[1]
            : null;
    },

    test(str: string): boolean {
        if (str.indexOf('::') === -1) return false;
        return (/^\s*:[^:]*?:[^:]+::/u).test(str);
    },
};

const HotKeys = {
    detail: 'HotKeys',
    kind: vscode.SymbolKind.Event,
    getName(str: string): string | null {
        const e = (/^\s*([^:]+::)/u).exec(str);
        return e
            ? e[1]
            : null;
    },

    test(str: string): boolean {
        if (str.indexOf('::') === -1) return false;
        return (/^\s*[^:]+::/u).test(str);
    },
};

export function ParserLine(FuncInput: FuncInputType): false | TAhkSymbol {
    const {
        DocStrMap,
        line,
        lStr,
    } = FuncInput;
    if (lStr === '') return false;
    const ahkGlobal = {
        detail: 'global',
        kind: vscode.SymbolKind.Variable,
        getName(_str: string): string | null {
            return setGlobalVar(FuncInput);
        },
        test(str: string): boolean {
            return (/^\s*\bglobal\b[\s,]/iu).test(str) && !(/^\s*global[\s,]+$/iu).test(str);
        },
    };

    const LineRuler: LineRulerType[] = isPerformanceMode()
        ? [ // // my project is 60~75
            IncludeAgain,
            Include,
            directive,
            ahkGlobal,
            // ahkLabel,
            // HotString,
            // HotKeys,
        ]
        : [ // // my project is 70~80
            IncludeAgain,
            Include,
            directive,
            ahkGlobal,
            // ahkStatic,
            // ahkThrow,
            ahkLabel,
            HotString,
            HotKeys,
        ];
    for (const ruler of LineRuler) {
        if (ruler.test(lStr)) {
            const name = ruler.getName(lStr);
            if (name) {
                const rangeRaw = getRangeOfLine(DocStrMap, line);
                return new vscode.DocumentSymbol(
                    name,
                    ruler.detail,
                    ruler.kind,
                    rangeRaw,
                    rangeRaw,
                );
            }
        }
    }
    return false;
}
