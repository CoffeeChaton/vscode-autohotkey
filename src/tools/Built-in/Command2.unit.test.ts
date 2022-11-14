/* eslint-disable max-depth */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import type { TCommandElement } from './Command';
import { LineCommand } from './Command';
import { cmd2Map } from './Command2';

const cmdDefMap1 = ((): ReadonlyMap<string, Readonly<TCommandElement>> => {
    const ma1 = new Map<string, Readonly<TCommandElement>>();
    for (const [k, v] of Object.entries(LineCommand)) {
        ma1.set(k, v);
    }
    console.log('🚀 ~ file: Command2.unit.test.ts ~ line 12 ~ cmdDefMap1 ~ ma1', ma1.size);
    console.log('🚀 ~ file: Command2.unit.test.ts ~ line 17 ~ cmdDefMap1 ~ cmd2Map', cmd2Map.size);

    return ma1;
})();

describe('check Command ruler', () => {
    it('err1: Command size .EQ.', () => {
        expect.hasAssertions();

        expect(cmdDefMap1.size === cmd2Map.size).toBeTruthy();

        const errList1: string[] = [];
        for (const [k, _v] of cmdDefMap1) {
            const def: string | undefined = cmd2Map.get(k);
            if (def === undefined) {
                errList1.push(k);
            }
        }

        if (errList1.length > 0) {
            console.error('🚀 ~ this is not cmd of errList1', errList1);
        }

        expect(errList1.length === 0).toBeTruthy();
    });

    it('err2: Command param len && OutVl', () => {
        expect.hasAssertions();

        const errList2: string[] = [];
        const errList3: string[] = [];
        const errList4: string[] = [];
        for (const [k, v] of cmdDefMap1) {
            const def: string | undefined = cmd2Map.get(k);
            if (def === undefined) continue; // check this at err1

            const { body, keyRawName } = v;
            const maList: RegExpMatchArray[] = [...body.matchAll(/\$\{\d+[|:]([^}]+)\}/ug)];
            if (maList.length !== def.length) {
                // check is like ${1:out} or ${2|optA,optB|}
                errList2.push(keyRawName);
                continue;
            }

            for (const [i, str] of [...def].entries()) {
                const st2: string = maList[i][1];
                if (str === 'O' && !st2.startsWith('Out')) {
                    errList3.push(keyRawName);
                    continue;
                }
            }

            for (const ma of maList) {
                // ma[0]: '${1|On,Off|}'
                // ma[1]: 'On,Off|'
                if (ma[0].includes('|')) {
                    const tempMa: RegExpMatchArray | null = ma[1].match(/^[\w,()-]+\|$/u);
                    if (tempMa === null && keyRawName !== 'SoundGet') { // N/A
                        errList4.push(`${keyRawName} => ${ma[1]}`);
                    }
                }
            }
        }

        if (errList2.length > 0) {
            console.warn('🚀 ~ different number of parameters ~ errList2', errList2);
        }
        if (errList3.length > 0) {
            console.error('🚀 ~ param of OutVal should startWith "Out"', errList3);
        }
        if (errList4.length > 0) {
            // eslint-disable-next-line no-template-curly-in-string
            console.error('🚀 ~ param of Option should use "${1|out1,Out2|}"', errList4);
        }

        expect(errList2.length === 0).toBeTruthy();
        expect(errList3.length === 0).toBeTruthy();
        expect(errList4.length === 0).toBeTruthy();
    });
});
