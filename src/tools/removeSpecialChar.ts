export function getSkipSign2(text: string): boolean {
    return (/^\s*[\w%[][.\w%[\]]*\s*=[^=]/).test(text);
}
export function getSkipSign(text: string): boolean {
    return (/^\s*msgbox\b/i).test(text)
        || (/^\s*(?:control)?send(?:Raw\b|\b.*{Raw})/i).test(text);
}

function fnReplacer(match: string, p1: string): string {
    return '_'.repeat(p1.length);
}

// [textFix , '; comment text']
export function getLStrOld(textRaw: string): string {
    if (textRaw[0] === ';') return '';
    if ((/^\s*;/).test(textRaw)) return '';
    const textFix = textRaw.replace(/`./g, '__').replace(/("[^"]*?")/g, fnReplacer);
    const i = textFix.indexOf(';');
    switch (i) {
        case -1:
            return textFix;
        case 0:
            return '';
        default:
            return textFix.substring(0, i);
    }
}
function removeSenRaw(textFix: string): string {
    const s0 = textFix.search(/\b(?:control)?send(?:Raw\b|\b.*{Raw})/i);
    return s0 === -1 ? textFix : textFix.substring(0, s0);
    // return textFix.replace(/\b(?:control)?sendRaw\b.*/i, '').replace(/\b(?:control)?send\b.*{Raw}.*/i, fnReplacer);
}
export function getLStr(textRaw: string): string {
    // TODO QUICK
    const text = textRaw.replace(/`./g, '__');
    let textFix = '';
    let tf = 1;
    const sL = text.length;
    for (let i = 0; i < sL; i++) {
        switch (text[i]) {
            case '"':
                tf *= -1;
                textFix += '_';
                break;
            case ';':
                if (tf === 1) {
                    return (/^\s*$/).test(textFix)
                        ? ''
                        : removeSenRaw(textFix);
                }
                textFix += '_';
                break;
            default:
                textFix += tf === 1 ? text[i] : '_';
                break;
        }
    }
    return (/^\s*$/).test(textFix)
        ? ''
        : removeSenRaw(textFix);
}
/**
```ahk
test LStr()
c := a . "123456789" . ff(";") . 2 * 851 * 33 / 2 - 33 . ";" . "`;---``" . "---" . dc ; 65486a"EO"
```
*/
