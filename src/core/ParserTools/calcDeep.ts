export function callDeep(lStrTrim: string, v: '{' | '}'): number {
    let d = 0;
    for (const s of lStrTrim) {
        switch (s) {
            case ' ':
            case '\t':
                break;

            case v:
                d++;
                break;

            default:
                return d;
        }
    }
    return d;
}
