export function removeParentheses(textRaw: string): string {
    let textFix = '';
    let deep = 0;
    const sL = textRaw.length;
    for (let i = 0; i < sL; i++) {
        switch (textRaw[i]) {
            case '(':
                deep++;
                textFix += ' ';
                break;
            case ')':
                deep--;
                textFix += ' ';
                break;
            default:
                textFix += deep === 0 ? textRaw[i] : ' ';
                break;
        }
    }
    return textFix;
}
