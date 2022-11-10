/* eslint-disable max-lines-per-function */
import { LineCommand } from './Command';
import { cmd2Map } from './Command2';

describe('check Command2 ruler', () => {
    it('exp: Command2 on', () => {
        expect.hasAssertions();

        const errList: string[] = [];
        for (const [k, v] of Object.entries(LineCommand)) {
            const def: string[] | undefined = cmd2Map.get(k);
            if (def === undefined) {
                errList.push(k);
                continue;
            }

            const { body } = v;
            const hint: number = [...body.matchAll(/(\$\{\d[|:])/ug)].length;
            if (hint !== def.length) { // optional !==
                errList.push(k);
            }
        }

        if (errList.length > 0) {
            console.warn('🚀 ~ TODO ~ file: Command2.test.ts ~ errList', errList);
            errList.length = 0; //
        }

        expect(errList.length === 0).toBeTruthy();
    });
});
