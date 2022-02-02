/* eslint-disable no-magic-numbers */
const Pad2 = (n: number): string => `${n}`.padStart(2, '0');

/**
 * return yyMMdd HH-mm-ss
 */
export function getNowDate(date: Date): string {
    const MM = Pad2(date.getMonth() + 1); // Fuxk of return [0-11]
    const dd = Pad2(date.getDate());

    const yyyyMMdd = `${date.getFullYear()}-${MM}-${dd}`;
    const HH = Pad2(date.getHours());
    const mm = Pad2(date.getMinutes());
    const ss = Pad2(date.getSeconds());
    return `${yyyyMMdd} ${HH}-${mm}-${ss}`;
}
