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
    getName: (strTrim: string) => string | null;
}>;

const IncludeAgain: LineRulerType = {
    detail: '#IncludeAgain',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        return strTrim.replace(/^#IncludeAgain\s+/ui, '#IncludeAgain ');
        // const e = (/^#IncludeAgain\s+?(\.+)/ui).exec(strTrim);
        // return e
        //     ? `#IncludeAgain ${e[1]}`
        //     : null;
    },

    test(strTrim: string): boolean {
        return (/^#IncludeAgain\s/iu).test(strTrim);
    },
};

const Include: LineRulerType = {
    detail: '#Include',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        return strTrim.replace(/^#Include\s+/ui, '#Include ');
        // const e = (/^#Include\s+?(\.+)/iu).exec(strTrim);
        // return e
        //     ? `#Include ${e[1]}`
        //     : null;
    },

    test(strTrim: string): boolean {
        return (/^#Include\s/iu).test(strTrim);
    },
};

const directive: LineRulerType = {
    detail: 'directive',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        const e = (/^(#\w+)/u).exec(strTrim);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        return (/^#/u).test(strTrim);
    },
};

const ahkLabel: LineRulerType = {
    detail: 'label',
    kind: vscode.SymbolKind.Package,
    getName(strTrim: string): string | null {
        const e = (/^(\w+:)/u).exec(strTrim);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        // if (strTrim.indexOf(':') < 1) return false;
        if (!strTrim.endsWith(':')) return false;
        // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
        return (/^\w+:$/u).test(strTrim);
    },
};

const HotString: LineRulerType = {
    // HotStr
    detail: 'HotString',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        const e = (/^(:[^:]*?:[^:]+::)/u).exec(strTrim);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        // Hotstring labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
        if (!strTrim.startsWith(':') && strTrim.indexOf('::') === -1) return false;
        return (/^:[^:]*?:[^:]+::/u).test(strTrim);
    },
};

const HotKeys: LineRulerType = {
    detail: 'HotKeys',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        const e = (/^([^:]+::)/u).exec(strTrim);
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
    const ahkGlobal: LineRulerType = {
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
            const name: string | null = ruler.getName(strTrim);
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
