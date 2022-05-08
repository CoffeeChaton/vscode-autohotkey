import * as vscode from 'vscode';
import { CAhkComment } from '../../AhkSymbol/CAhkComment';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkHotKeys';
import { CAhkHotString } from '../../AhkSymbol/CAhkHotString';
import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import { CAhkLabel } from '../../AhkSymbol/CAhkLabel';
import { EDetail } from '../../globalEnum';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import { TFuncInput } from '../getChildren';

type TClassName = typeof CAhkInclude | typeof CAhkLabel | typeof CAhkHotString | typeof CAhkHotKeys;
type TParserLine = CAhkInclude | CAhkLabel | CAhkHotString | CAhkHotKeys;

type TLineRuler = Readonly<{
    ClassName: TClassName;
    getName(strTrim: string): string | null;
    test(strTrim: string): boolean;
}>;

const LineRuler: readonly TLineRuler[] = [
    {
        ClassName: CAhkInclude,

        getName(strTrim: string): string | null {
            return strTrim;
        },

        test(strTrim: string): boolean {
            if (!strTrim.startsWith('#')) return false;
            return (/^#Include(?:Again)?\s/iu).test(strTrim);
        },
    },
    {
        ClassName: CAhkLabel,

        getName(strTrim: string): string {
            const col = strTrim.indexOf(':');
            return strTrim.substring(0, col);
        },

        test(strTrim: string): boolean {
            if (!strTrim.endsWith(':')) return false;
            if (strTrim.endsWith('::')) return false;
            // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
            return (/^\w+:$/u).test(strTrim);
        },
    },
    {
        ClassName: CAhkHotString,

        getName(strTrim: string): string | null {
            const e: RegExpMatchArray | null = strTrim.match(/^(:[^:]*?:[^:]+::)/u);
            return (e !== null)
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
    },
    {
        ClassName: CAhkHotKeys,

        getName(strTrim: string): string | null {
            // ex ~F10::
            const e: RegExpExecArray | null = (/^([^:]+::)/u).exec(strTrim);
            return (e !== null)
                ? e[1]
                : null;
        },

        test(strTrim: string): boolean {
            // Hotkey labels consist of a hotkey followed by double-colon.
            // if (strTrim.startsWith(':')) return false;
            if (strTrim.indexOf('::') === -1) return false;
            return (/^[^:]+::/u).test(strTrim);
        },
    },
];

function getComment(FuncInput: TFuncInput): null | CAhkComment {
    const {
        line,
        lStr,
        DocStrMap,
        document,
    } = FuncInput;

    const { textRaw, detail, lineComment } = DocStrMap[line];
    if (detail.indexOf(EDetail.hasDoubleSemicolon) === -1) return null;

    // ;;
    if (!(/^\s*;;/u).test(textRaw)) return null;

    const doubleSemicolon = textRaw.indexOf(';;', lStr.length);

    const name: string = lineComment.replace(/^;;/u, '');
    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, doubleSemicolon + 2),
        new vscode.Position(line, textRaw.length),
    );
    return new CAhkComment({
        name,
        range,
        selectionRange: range,
        uri: document.uri,
    });
}

export function ParserLine(FuncInput: TFuncInput): null | TParserLine | CAhkComment {
    const {
        fistWordUp,
        line,
        lStr,
        document,
        textRaw,
    } = FuncInput;

    const strTrim: string = lStr.trim();
    if (strTrim === '') return getComment(FuncInput);

    if (fistWordUp.length > 0) return null;

    for (const { test, getName, ClassName } of LineRuler) {
        if (!test(strTrim)) continue;
        const name: string | null = getName(strTrim);
        if (name === null) continue;

        const range: vscode.Range = getRangeOfLine(line, lStr, textRaw.length);
        return new ClassName({
            name,
            range,
            selectionRange: range,
            uri: document.uri,
        });
    }
    return null;
}
