import { BuiltInFunctionObj } from './func';

describe('check BuiltInFunctionObj ruler', () => {
    it('exp : ABS() .. WinExist()', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [k, v] of Object.entries(BuiltInFunctionObj)) {
            const { keyRawName, insert, exp } = v;

            const v1 = k.toUpperCase() !== k;
            const v2 = keyRawName.toUpperCase() !== k;
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
