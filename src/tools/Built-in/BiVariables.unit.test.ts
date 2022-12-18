import * as tmLanguage from '../../../syntaxes/ahk.tmLanguage.json';
import { BiVariables } from './BiVariables.data';

describe('check BiVariables ruler', () => {
    const arr1: string[] = BiVariables
        .map((v): string => v.keyRawName);

    it('check : BiVariables length .EQ. 8', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        if (arr1.length !== 8) {
            console.warn('🚀 ~ arr1.length', arr1.length);
        }

        // eslint-disable-next-line no-magic-numbers
        expect(arr1.length === 8).toBeTruthy();
    });

    //
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (tmLanguage.repository.builtin_variable.patterns[1].match)
            .replace('(?<![.#])\\b(?i:', '')
            .replace(')\\b', '');

        expect(st1 === arr1.join('|')).toBeTruthy();
    });
});
