import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { otherKeyword2 } from './otherKeyword2.data';

describe('check otherKeyword2 ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr = otherKeyword2
            .map((v) => v.keyRawName)
            .join('|');

        const st1 = (repository.other_keyword.patterns[1].match)
            .replace('(?:^|[ \\t])(?i:', '')
            .replace(')(?:$|[ \\t])', '');

        if (st1 !== tsStr) {
            console.warn('🚀 ~ tsStr', tsStr);
            console.warn('🚀 ~ st1', st1);
        }

        expect(st1 === tsStr).toBeTruthy();
    });
});
