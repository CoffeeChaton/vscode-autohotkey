import { repository } from '../../../syntaxes/ahk.tmLanguage.json';

import { Ahk2exeData } from './Ahk2exe.data';

describe('check Ahk2exeData ruler', () => {
    it('check : name ruler', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const v of Ahk2exeData) {
            const {
                keyRawName,
                body,
                exp,
            } = v;

            const V3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);

            if (V3 || v4) {
                errState++;
                console.error(
                    '--15--37--51--76--66',
                    {
                        V3,
                        v4,
                        keyRawName,
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

        const st1: string = (repository.comment_ahk2exe.match)
            .replace('^[ \\t]*;(?i:@Ahk2Exe-(', '')
            .replace(')\\b).*', '');

        const arr: string = Ahk2exeData
            .map((v): string => v.keyRawName)
            .join('|');

        expect(st1 === arr).toBeTruthy();
    });

    it('check : Ahk2exeData length .EQ. 30', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        if (Ahk2exeData.length !== 30) {
            console.warn('🚀 ~ arr1.length', Ahk2exeData.length);
        }

        // eslint-disable-next-line no-magic-numbers
        expect(Ahk2exeData.length === 30).toBeTruthy();
    });
});
