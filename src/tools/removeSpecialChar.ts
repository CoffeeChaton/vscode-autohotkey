export function getSkipSign2(text: string): boolean {
    return (/^\s*[\w%[][.\w%[\]]*\s*=[^=]/).test(text);
}
export function getSkipSign(text: string): boolean {
    const skipList: RegExp[] = [
        //   /^\s*;/,
        // /^sleep\b/i,
        /^\s*msgbox\b/i,
        //  /^gui\b/i,
        //  /^send(?:raw|input|play|event)?[,\s]/i,
        /^\s*(?:control)?sendRaw\b/i,
        /^\s*(?:control)?send\b.*{Raw}/i,
        // TODO /^\s\w\w*[\s,][\s,]*/  .eq. command
        //  /^\s*::/,
        //  /^menu[,\s]/i,
        //   /^s*loop[,\s][,\s]*parse,/,
        // [^+\--:=><*!/\w~)"]=[^=]
    ];
    const iMax = skipList.length;
    for (let i = 0; i < iMax; i += 1) {
        if (skipList[i].test(text)) return true;
    }
    return false;
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
export function getLStr(textRaw: string): string {
    //  TODD QUICK
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
                        : textFix.replace(/(?:control)?sendRaw\b.*/i, '').replace(/(?:control)?send\b.*{Raw}.*/i, '');
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
        : textFix.replace(/(?:control)?sendRaw\b.*/i, '').replace(/(?:control)?send\b.*{Raw}.*/i, '');
}
/**
```ahk
test LStr()
c := a . "123456789" . ff(";") . 2 * 851 * 33 / 2 - 33 . ";" . "`;---``" . "---" . dc ; 65486a"EO"
```
*/
