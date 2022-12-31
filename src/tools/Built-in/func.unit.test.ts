import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { funcDataList } from './func.data';

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check BuiltInFunctionObj ruler', () => {
    it('exp : ABS() .. WinExist()', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        for (const v of funcDataList) {
            const {
                keyRawName,
                insert,
                exp,
                upName,
            } = v;

            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !insert.startsWith(keyRawName);
            const v4 = !exp.join('\n').includes(keyRawName);
            if (v1 || v2 || v3 || v4) {
                errList.push({
                    msg: '--04--85--15--15',
                    value: {
                        v1,
                        v2,
                        v3,
                        v4,
                        upName,
                        v,
                    },
                });
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const arr1: string[] = funcDataList.map((v): string => v.keyRawName);

        const st1 = (repository.func_call.patterns[0].match)
            .replace('(?<![.`%#])\\b(?i:', '')
            .replace(')(?=\\()\\b', '');

        const max = 111;

        expect(funcDataList).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });
});
