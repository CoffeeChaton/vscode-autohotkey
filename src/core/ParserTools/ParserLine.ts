/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { DeepReadonly, TAhkSymbol } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
// import { removeBigParentheses } from '../tools/removeBigParentheses';
// import { removeParentheses } from '../tools/removeParentheses';
import { FuncInputType } from '../getChildren';
import { setGlobalVar } from './setGlobalVar';

type LineRulerType = DeepReadonly<{
    detail: string;
    kind: vscode.SymbolKind;
    // regex?: RegExp,
    test: (strTrim: string) => boolean;
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

    test(strTrim: string): boolean {
        return (/^#IncludeAgain\b/iu).test(strTrim);
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

    test(strTrim: string): boolean {
        return (/^#Include\b/iu).test(strTrim);
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

    test(strTrim: string): boolean {
        return (/^#/u).test(strTrim);
    },
};

const ahkLabel = {
    detail: 'label',
    kind: vscode.SymbolKind.Package,
    getName(str: string): string | null {
        const e = (/^\s*(\w+:)/u).exec(str);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        if (strTrim.indexOf(':') < 1) return false;
        // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
        return (/^\w+:$/u).test(strTrim);
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

    test(strTrim: string): boolean {
        // Hotstring labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
        if (strTrim.indexOf('::') === -1) return false;
        return (/^:[^:]*?:[^:]+::/u).test(strTrim);
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

    test(strTrim: string): boolean {
        // Hotkey labels consist of a hotkey followed by double-colon.
        if (strTrim.indexOf('::') === -1) return false;
        return (/^[^:]+::/u).test(strTrim);
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
        test(strTrim: string): boolean {
            return (/^global\b[\s,]/iu).test(strTrim) && !(/^global[\s,]+$/iu).test(strTrim);
        },
    };

    const LineRuler: LineRulerType[] = [
        IncludeAgain,
        Include,
        directive,
        ahkGlobal,
        ahkLabel,
        HotString,
        HotKeys,
    ];

    const strTrim = lStr.trim();
    for (const ruler of LineRuler) {
        if (ruler.test(strTrim)) {
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
