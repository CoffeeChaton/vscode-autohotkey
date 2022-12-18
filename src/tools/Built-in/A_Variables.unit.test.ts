import * as tmLanguage from '../../../syntaxes/ahk.tmLanguage.json';
import { AVariablesList } from './A_Variables.data';

describe('check A_Variables ruler', () => {
    const arr1: string[] = AVariablesList
        .map((v): string => v.body.replace('A_', ''));

    it('check : A_Variables length .EQ. 158', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        expect(arr1.length === 158).toBeTruthy();
    });

    //
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (tmLanguage.repository.builtin_variable.patterns[0].match)
            .replace('(?<![.#])\\b(?i:A_(?:', '')
            .replace('))\\b', '');

        expect(st1 === arr1.join('|')).toBeTruthy();
    });
});
