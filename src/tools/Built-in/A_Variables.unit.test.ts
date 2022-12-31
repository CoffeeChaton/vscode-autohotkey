import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { AVariablesList } from './A_Variables.data';

describe('check A_Variables ruler', () => {
    const arr1: string[] = AVariablesList
        .map((v): string => v.body.replace('A_', ''));

    const max = 158;

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (repository.builtin_variable.patterns[0].match)
            .replace('(?<![.#])\\b(?i:A_(?:', '')
            .replace('))\\b', '');

        expect(arr1).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });
});
