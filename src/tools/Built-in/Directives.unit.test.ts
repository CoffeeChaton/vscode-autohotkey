import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { DirectivesList } from './Directives.data';

describe('check #Directive ruler', () => {
    const max = 37;

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        const arr1: string[] = DirectivesList
            .map((v): string => v.keyRawName.replace('#', ''))
            .sort();

        const st1 = (repository.directives.patterns[1].match)
            .replace('^[ \\t]*#\\b(?i:', '')
            .replace(')\\b([^;]*)([ \\t]+;.*)?$', '');

        expect(arr1).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });
});
