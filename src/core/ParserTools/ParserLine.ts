/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { DeepReadonly, TAhkSymbol } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
// import { removeBigParentheses } from '../tools/removeBigParentheses';
// import { removeParentheses } from '../tools/removeParentheses';
import { TFuncInput } from '../getChildren';
import { ahkGlobalMain } from './ahkGlobalDef';

type TLineRuler = DeepReadonly<{
    detail: string;
    kind: vscode.SymbolKind;
    // regex?: RegExp,
    test: (strTrim: string) => boolean;
    getName: (strTrim: string) => string | null;
}>;

const IncludeAgain: TLineRuler = {
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

const Include: TLineRuler = {
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

const ahkLabel: TLineRuler = {
    detail: 'label',
    kind: vscode.SymbolKind.Package,
    getName(strTrim: string): string | null {
        const e: RegExpMatchArray | null = strTrim.match(/^(\w+:)/u);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        if (!strTrim.endsWith(':')) return false;
        // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
        return (/^\w+:$/u).test(strTrim);
    },
};

const HotString: TLineRuler = {
    // HotStr
    detail: 'HotString',
    kind: vscode.SymbolKind.Event,
    getName(strTrim: string): string | null {
        const e: RegExpMatchArray | null = strTrim.match(/^(:[^:]*?:[^:]+::)/u);
        return e
            ? e[1]
            : null;
    },

    test(strTrim: string): boolean {
        // https://www.autohotkey.com/docs/misc/Labels.htm#syntax-and-usage
        // HotString labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
        // if (!strTrim.startsWith(':')) return false;
        if (strTrim.indexOf('::') === -1) return false;
        return (/^:[^:]*?:[^:]+::/u).test(strTrim);
    },
};

const HotKeys: TLineRuler = {
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
        // if (strTrim.startsWith(':')) return false;
        if (strTrim.indexOf('::') === -1) return false;
        return (/^[^:]+::/u).test(strTrim);
    },
};

export function ParserLine(FuncInput: TFuncInput): null | TAhkSymbol {
    const {
        fistWordUp,
        DocStrMap,
        line,
        lStr,
        GValMap,
    } = FuncInput;
    const strTrim: string = lStr.trim();
    if (strTrim === '') return null;

    if (fistWordUp) {
        ahkGlobalMain(GValMap, fistWordUp, lStr, line);
        return null;
    }

    const LineRuler: TLineRuler[] = [
        IncludeAgain,
        Include,
        ahkLabel,
        HotString,
        HotKeys,
    ];

    for (const ruler of LineRuler) {
        if (ruler.test(strTrim)) {
            const name: string | null = ruler.getName(strTrim);
            if (name !== null) {
                const rangeRaw: vscode.Range = getRangeOfLine(DocStrMap, line);
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
    return null;
}
