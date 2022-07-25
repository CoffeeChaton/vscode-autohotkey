import { BuiltInFunctionObj } from './func';

test('Check BuiltInFunctionObj ruler', () => {
    for (const [k, v] of Object.entries(BuiltInFunctionObj)) {
        const { keyRawName, insert, exp } = v;

        const v1 = k.toUpperCase() !== k;
        const v2 = keyRawName.toUpperCase() !== k;
        const v3 = !insert.startsWith(keyRawName);
        const v4 = !exp.join('\n').includes(keyRawName);
        if (v1 || v2 || v3 || v4) {
            console.error('🚀 ~ test ~ v1~v4', v1, v2, v3, v4);
            console.error('🚀 ~ test ~  k', k);
            console.error('🚀 ~ test ~  v', v);
            expect(false).toBeTruthy();
        }
    }
});
