export function isSetVarTradition(text: string): boolean {
    // Var = Value
    // https://www.autohotkey.com/docs/Variables.htm#operators
    // is https://wyagd001.github.io/zh-cn/docs/commands/SetEnv.htm
    const t = text.trim();
    const col0 = t.indexOf('=');
    // a=
    // 01
    if (col0 < 1) return false;
    if (t[col0 + 1] === '=') return false;

    switch (t[col0 - 1]) {
        case ':': // :=
        case '<': // <=
        case '>': // >=
        case '~': // ~=
        case '+': // +=
        case '-': // -=
        case '*': // *=
        case '/': // /=
        case '.': // .=
        case '|': // |=
        case '&': // &=
        case '^': // ^=:
            return false;
        default:
            break;
    }
    const eqLeftStr = t.substring(0, col0).trim();

    return (/^[%\w.[\]]+$/u).test(eqLeftStr);
    // return (/^\s*[\w%[][.\w%[\]]*\s*=[^=]/u).test(t);
}

export const replacerSpace = (match: string): string => ' '.repeat(match.length);

const fnReplacerStr = (match: string): string => '_'.repeat(match.length);

// [textFix , '; comment text']
export function getLStr(textRaw: string): string {
    if (textRaw[0] === ';') return '';
    if ((/^\s*;/u).test(textRaw)) return '';
    const textFix = textRaw.replace(/`./ug, '__').replace(/"[^"]*?"/ug, fnReplacerStr);
    const i = textFix.indexOf(';');
    // dprint-ignore
    switch (i) {
        case -1: return textFix;
        case 0: return '';
        default: return textFix.substring(0, i);
    }
}
