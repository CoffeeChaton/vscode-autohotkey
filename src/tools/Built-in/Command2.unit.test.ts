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
    return ma1;
})();

describe('check Command ruler', () => {
    it('check: Command size .EQ. 183', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        expect(cmd2Map.size === 183).toBeTruthy();
        expect(cmdDefMap1.size === cmd2Map.size).toBeTruthy();

        const errList1: string[] = [];
        for (const [k, _v] of cmdDefMap1) {
            if (!cmd2Map.has(k)) {
                errList1.push(k);
            }
        }

        if (errList1.length > 0) {
            console.error('🚀 ~ this is not cmd of errList1', errList1);
        }

        expect(errList1.length === 0).toBeTruthy();
    });

    it('check: command param naming rules', () => {
        expect.hasAssertions();

        const errList2: string[] = [];
        const errList3: string[] = [];
        const errList4: string[] = [];
        const errList5: string[] = [];
        for (const [k, v] of cmdDefMap1) {
            const def: string | undefined = cmd2Map.get(k);
            if (def === undefined) continue; // check this at err1

            const { body, keyRawName } = v;
            // check grammar like ${1:out} or ${2|Option1,Option2|} // https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax
            const maList: RegExpMatchArray[] = [...body.matchAll(/\$\{\d+[|:]([^}]+)\}/ug)];
            if (maList.length !== def.length) {
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
                // check like grammar like ${2|Option1,Option2|}
                if (ma[0].includes('|')) {
                    const tempMa: RegExpMatchArray | null = ma[1].match(/^[\w,()-]+\|$/u);
                    if (tempMa === null && keyRawName !== 'SoundGet') { // N/A
                        errList4.push(`${keyRawName} => ${ma[1]}`);
                    }
                } else if (!(/^[.\w #:\\-]+$/u).test(ma[1])) {
                    errList5.push(`${keyRawName} => ${ma[1]}`);
                }
            }
        }

        if (errList2.length > 0) {
            console.warn('🚀 ~ number of parameters', errList2);
        }
        if (errList3.length > 0) {
            console.error('🚀 ~ param of OutVal should startWith "Out"', errList3);
        }
        if (errList4.length > 0) {
            // eslint-disable-next-line no-template-curly-in-string
            console.error('🚀 ~ param of Option should use "${1|Option1,Option2|}"', errList4);
        }
        if (errList5.length > 0) {
            console.error('🚀 ~ complex parameter names', errList5);
        }

        expect(errList2.length === 0).toBeTruthy();
        expect(errList3.length === 0).toBeTruthy();
        expect(errList4.length === 0).toBeTruthy();
        expect(errList5.length === 0).toBeTruthy();
    });
});
