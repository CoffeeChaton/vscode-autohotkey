import { LineCommand } from './Command';

test('Check LineCommand ruler', () => {
    for (const [k, v] of Object.entries(LineCommand)) {
        const { keyRawName, body, exp } = v;

        const v1 = k.toUpperCase() !== k;
        const v2 = keyRawName.toUpperCase() !== k;
        const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
        const v4 = (exp !== undefined) && !exp.join('\n').includes(keyRawName);
        if (v1 || v2 || v3 || v4) {
            console.error(
                '~ test ~ Check LineCommand ruler',
                {
                    v1,
                    v2,
                    v3,
                    v4,
                    k,
                    v,
                },
            );
            expect(false).toBeTruthy();
        }
    }
});
