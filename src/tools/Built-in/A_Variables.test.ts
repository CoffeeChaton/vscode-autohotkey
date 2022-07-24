import { A_Variables } from './A_Variables_Data';

test('Check A_Variables name ruler', () => {
    for (const [k, v] of Object.entries(A_Variables)) {
        if (
            !k.startsWith('A_')
            || !v.body.startsWith('A_')
            || v.body !== k
        ) {
            expect(false).toBeTruthy();
        }
        // expect(k.startsWith('A_')).toBeTruthy();
        // expect(v.body.startsWith('A_')).toBeTruthy();
        // expect(v.body === k).toBeTruthy();
    }
});
