import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { DirectivesList } from './Directives.data';

describe('check #Directive ruler', () => {
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const arr1: string[] = DirectivesList
        .map((v): string => v.keyRawName.replace('#', ''))
        .sort();

    it('check : #Directive length', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        expect(arr1.length === 37).toBeTruthy();
    });

    //
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (repository.directives.patterns[1].match)
            .replace('^[ \\t]*#\\b(?i:', '')
            .replace(')\\b([^;]*)([ \\t]+;.*)?$', '');

        expect(st1 === arr1.join('|')).toBeTruthy();
    });
});
