import { Statement } from './statement';

test('Check Statement ruler', () => {
    for (const [k, v] of Object.entries(Statement)) {
        const { keyRawName, body, exp } = v;
        const v1 = k.toUpperCase() !== k;
        const v2 = keyRawName.toUpperCase() !== k;
        const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
        const v4 = !exp.join('\n').includes(keyRawName);
        if (v1 || v2 || v3 || v4) {
            console.error(
                '~ test ~ Check Statement ruler',
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
