import type * as vscode from 'vscode';
import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { CAhkComment, TBaseLineParam, TLineClass } from '../../AhkSymbol/CAhkLine';
import {
    CAhkDirectives,
    CAhkHotKeys,
    CAhkHotString,
    CAhkLabel,
} from '../../AhkSymbol/CAhkLine';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import type { TFuncInput } from '../getChildren';
import { getComment } from './getComment';

type TLineRuler = Readonly<{
    makeSymbol: (obj: TBaseLineParam) => TLineClass,
    getName: (strTrim: string) => string | null,
    test: (strTrim: string) => boolean,
}>;

const LineRuler = [
    {
        // #Include
        makeSymbol(obj: TBaseLineParam): CAhkInclude {
            return new CAhkInclude(obj);
        },

        getName(strTrim: string): string | null {
            return strTrim;
        },

        test(strTrim: string): boolean {
            if (!strTrim.startsWith('#')) return false;
            return (/^#Include(?:Again)?\s/iu).test(strTrim);
        },
    },
    {
        // label:
        makeSymbol(obj: TBaseLineParam): CAhkLabel {
            return new CAhkLabel(obj);
        },

        getName(strTrim: string): string {
            const col = strTrim.indexOf(':');
            return strTrim.slice(0, col + 1);
        },

        test(strTrim: string): boolean {
            if (!strTrim.endsWith(':')) return false;
            if (strTrim.endsWith('::')) return false;
            // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
            return (/^\w+:$/u).test(strTrim);
        },
    },
    {
        // :?:; btu::; but
        //    ^has ;
        // ::hs,,::HotString
        makeSymbol(obj: TBaseLineParam): CAhkHotString {
            return new CAhkHotString(obj);
        },

        getName(strTrim: string): string | null {
            const e: RegExpMatchArray | null = strTrim.match(/^(:[^:]*:[^:]+::)/u);
            return (e === null)
                ? null
                : e[1];
        },

        test(strTrim: string): boolean {
            // https://www.autohotkey.com/docs/v1/misc/Labels.htm#syntax-and-usage
            // HotString labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
            // if (!strTrim.startsWith(':')) return false;
            if (!strTrim.includes('::')) return false;
            return (/^:[^:]*:[^:]+::/u).test(strTrim);
        },
    },
    {
        // ~F10::
        makeSymbol(obj: TBaseLineParam): CAhkHotKeys {
            return new CAhkHotKeys(obj);
        },

        getName(strTrim: string): string | null {
            const m: RegExpMatchArray | null = strTrim.match(/^([^:]+::)/u);
            return (m === null)
                ? null
                : m[1];
        },

        test(strTrim: string): boolean {
            // Hotkey labels consist of a hotkey followed by double-colon.
            // if (strTrim.startsWith(':')) return false;
            if (!strTrim.includes('::')) return false;
            return (/^[^:]+::/u).test(strTrim);
        },
    },
    {
        // #NoEnv
        makeSymbol(obj: TBaseLineParam): CAhkDirectives {
            return new CAhkDirectives(obj);
        },

        getName(strTrim: string): string | null {
            const m: RegExpMatchArray | null = strTrim.match(/^(#\w+)\b/u);
            return (m === null)
                ? null
                : m[1];
        },

        test(strTrim: string): boolean {
            // Hotkey labels consist of a hotkey followed by double-colon.
            // if (strTrim.startsWith(':')) return false;
            if (!strTrim.startsWith('#')) return false;
            return (/^#\w+\b/u).test(strTrim);
        },
    },
] as const satisfies readonly TLineRuler[];

export function ParserLine(FuncInput: TFuncInput): CAhkComment | TLineClass | null {
    const { lStr, fistWordUp } = FuncInput.AhkTokenLine;

    const strTrim: string = lStr.trim();
    if (strTrim === '') return getComment(FuncInput);

    if (fistWordUp !== '' && fistWordUp !== 'DEFAULT') return null;

    const { AhkTokenLine, uri } = FuncInput;
    const { line } = AhkTokenLine;

    for (const { test, getName, makeSymbol } of LineRuler) {
        if (!test(strTrim)) continue;
        const name: string | null = getName(strTrim);
        if (name === null) continue;

        const rangeOfLine: vscode.Range = getRangeOfLine(line, lStr, lStr.length);
        return makeSymbol({
            name,
            range: rangeOfLine,
            selectionRange: rangeOfLine,
            uri,
            AhkTokenLine,
        });
    }
    return null;
}
