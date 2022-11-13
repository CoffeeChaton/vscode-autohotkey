/* eslint-disable max-lines-per-function */
import { LineCommand } from './Command';
import { cmd2Map } from './Command2';

describe('check Command2 ruler', () => {
    it('exp: Command2 on', () => {
        expect.hasAssertions();

        const errList1: string[] = [];
        const errList2: string[] = [];
        const errList3: string[] = [];
        for (const [k, v] of Object.entries(LineCommand)) {
            const def: string | undefined = cmd2Map.get(k);
            if (def === undefined) {
                errList1.push(k);
                continue;
            }

            const { body } = v;
            const maList: RegExpMatchArray[] = [...body.matchAll(/\$\{\d[|:]([^}]+\})/ug)];
            if (maList.length !== def.length) { // optional !==
                errList2.push(k);
                continue;
            }

            for (const [i, str] of [...def].entries()) {
                const st2: string = maList[i][1];
                if (str === 'O' && !st2.startsWith('Out')) {
                    errList3.push(k);
                    continue;
                }
            }
        }

        if (errList1.length > 0) {
            console.error('🚀 ~ this is not cmd of errList1', errList1);
        }
        if (errList2.length > 0) {
            console.warn('🚀 ~ TODO ~ different number of parameters ~ errList2', errList2);
            errList2.length = 0;
        }
        if (errList3.length > 0) {
            console.error('🚀 ~ param of OutVal should startWith "Out"', errList3);
        }

        expect(errList1.length === 0).toBeTruthy();
        expect(errList3.length === 0).toBeTruthy();
    });
});
