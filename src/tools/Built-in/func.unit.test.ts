import * as tmLanguage from '../../../syntaxes/ahk.tmLanguage.json';
import { BuiltInFunctionObj } from './func.data';

describe('check BuiltInFunctionObj ruler', () => {
    const arr1: string[] = [];

    it('check: Command size .EQ. 111', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        if (BuiltInFunctionObj.length !== 111) {
            console.warn('🚀 ~ BuiltInFunctionObj.length', BuiltInFunctionObj.length);
        }

        // eslint-disable-next-line no-magic-numbers
        expect(BuiltInFunctionObj.length === 111).toBeTruthy();
    });

    it('exp : ABS() .. WinExist()', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const v of BuiltInFunctionObj) {
            const {
                keyRawName,
                insert,
                exp,
                upName,
            } = v;
            arr1.push(keyRawName);

            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !insert.startsWith(keyRawName);
            const v4 = !exp.join('\n').includes(keyRawName);
            if (v1 || v2 || v3 || v4) {
                errState++;
                console.error(
                    '--04--85--15--15',
                    {
                        v1,
                        v2,
                        v3,
                        v4,
                        upName,
                        v,
                    },
                );
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1 = (tmLanguage.repository.func_call.patterns[0].match)
            .replace('(?<![.`%#])\\b(?i:', '')
            .replace(')(?=\\()\\b', '');

        expect(st1 === arr1.join('|')).toBeTruthy();
    });
});
