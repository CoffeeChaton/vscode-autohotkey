/* eslint-disable max-lines-per-function */
import { EDiagCode } from '../../diag';
import { LineCommand } from './Command';

describe('check LineCommand ruler', () => {
    it('exp: AutoTrim on', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [k, v] of Object.entries(LineCommand)) {
            const {
                keyRawName,
                body,
                exp,
                diag,
                recommended,
            } = v;

            const v1 = k.toUpperCase() !== k;
            const v2 = keyRawName.toUpperCase() !== k;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = (exp !== undefined) && !exp.join('\n').includes(keyRawName);
            const v5 = diag !== undefined && recommended !== undefined && recommended;
            if (v1 || v2 || v3 || v4 || v5) {
                errState++;
                console.error(
                    '--86--32--51--78--64',
                    {
                        v1,
                        v2,
                        v3,
                        v4,
                        v5,
                        k,
                        v,
                    },
                );
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });

    it('check EDiagCode.code700', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [fistWord, v] of Object.entries(LineCommand)) {
            const { diag } = v;
            const nameCheck =
                (/^(?:File(Append|GetAttrib|Read)|GetKeyState|If(?:Not)?(?:Exist|InString)|IfWin(?:Not)?(?:Active|Exist))$/ui)
                    .test(fistWord)
                || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/ui).test(
                    fistWord,
                );

            if (nameCheck && (diag === undefined || diag !== EDiagCode.code700)) {
                errState++;
                console.error('--86--32--4', { k: fistWord, v });
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });
});
