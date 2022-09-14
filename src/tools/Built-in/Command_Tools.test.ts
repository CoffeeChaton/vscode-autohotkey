import { LineCommand } from './Command';

describe('check LineCommand ruler', () => {
    it('exp: AutoTrim on', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [k, v] of Object.entries(LineCommand)) {
            const { keyRawName, body, exp } = v;

            const v1 = k.toUpperCase() !== k;
            const v2 = keyRawName.toUpperCase() !== k;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = (exp !== undefined) && !exp.join('\n').includes(keyRawName);
            if (v1 || v2 || v3 || v4) {
                errState++;
                console.error(
                    '--86--32--51--78--64',
                    {
                        v1,
                        v2,
                        v3,
                        v4,
                        k,
                        v,
                    },
                );
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });
});
