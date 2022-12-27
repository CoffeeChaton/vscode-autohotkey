import { repository } from '../../../syntaxes/ahk.tmLanguage.json';

describe('check tmLanguage ruler', () => {
    it('check : repository key_name should be snake_case', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        for (const keyName of Object.keys(repository)) {
            if (!(/^[a-z][a-z\d_]+$/u).test(keyName)) {
                errList0.push(keyName);
            }
        }

        if (errList0.length > 0) console.warn('🚀 ~ errList', errList0);

        expect(errList0.length === 0).toBeTruthy();
    });
});
