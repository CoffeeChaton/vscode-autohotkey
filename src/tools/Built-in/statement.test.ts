import { Statement } from './statement';

/**
 * Capitalize<Lowercase<str>>;
 */
function CapitalizeLowercase(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

describe('check Statement ruler', () => {
    it('exp: and or break if return', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [k, v] of Object.entries(Statement)) {
            const { keyRawName, body, exp } = v;

            const v1 = k.toUpperCase() !== k;
            const v2 = keyRawName.toUpperCase() !== k;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = !k.startsWith('IF') && keyRawName !== CapitalizeLowercase(k);
            if (v1 || v2 || v3 || v4 || v5) {
                errState++;
                console.error(
                    '--15--36--49--76--56',
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
