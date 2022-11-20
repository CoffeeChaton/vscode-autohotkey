import { getFistWordCore } from './getFistWordUpData';

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
        const lStrFix: string = lStr.slice(lStr.indexOf(':') + 1).trim();
        if (lStrFix === '') {
            return { SecondWordUpCol: -1, SecondWordUp: '' };
        }

        const SecondWord: string = lStrFix.match(/^(\w+)$/u)?.[1] ?? getFistWordCore(lStrFix);
        if (SecondWord === '') {
            return { SecondWordUpCol: -1, SecondWordUp: '' };
        }

        const col: number = lStrFix.padStart(lStr.length, ' ').indexOf(SecondWord);
        if (col === -1) {
            console.warn('🚀', col);
            return { SecondWordUpCol: -1, SecondWordUp: '' };
        }

        return {
            SecondWordUp: SecondWord.toUpperCase(),
            SecondWordUpCol: col,
        };
    }

    return { SecondWordUpCol: -1, SecondWordUp: '' };
}
