import { BuiltInFunctionObj } from './func';

test('Check BuiltInFunctionObj ruler', () => {
    for (const [k, v] of Object.entries(BuiltInFunctionObj)) {
        const { keyRawName, insert, exp } = v;

        const v1 = k.toUpperCase() !== k;
        const v2 = keyRawName.toUpperCase() !== k;
        const v3 = !insert.startsWith(keyRawName);
        const v4 = !exp.join('\n').includes(keyRawName);
        if (v1 || v2 || v3 || v4) {
            console.error(
                '~ test ~ Check BuiltInFunctionObj ruler',
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
