type TSecondUpData = {
    SecondWordUp: string;
    SecondWordUpCol: number;
};

/**
 * ```js
 *     if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT')
 * ```
 */
export function getSecondUp(lStr: string, fistWordUp: string): TSecondUpData {
    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT') {
        const ma: RegExpMatchArray | null = lStr.match(/:\s*\b(\w+)\b[ \t,$]/ui);
        if (ma === null) {
            return { SecondWordUpCol: -1, SecondWordUp: '' };
        }

        const i: number | undefined = ma.index;
        if (i === undefined) {
            return { SecondWordUpCol: -1, SecondWordUp: '' };
        }
        // did i need to check `SecondWordUp := 0` ?
        return {
            SecondWordUp: ma[1].toUpperCase(),
            SecondWordUpCol: i + ma[0].indexOf(ma[1]),
        };
    }

    return { SecondWordUpCol: -1, SecondWordUp: '' };
}
