/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import * as tmLanguage from '../../../syntaxes/ahk.tmLanguage.json';
import { EDiagCode } from '../../diag';
import { LineCommand } from './Command.data';

describe('check LineCommand ruler', () => {
    it('check: Command size .EQ. 180', () => {
        expect.hasAssertions();

        // eslint-disable-next-line no-magic-numbers
        if (LineCommand.length !== 180) {
            console.error('🚀 ~ LineCommand.length', LineCommand.length);
        }

        // eslint-disable-next-line no-magic-numbers
        expect(LineCommand.length === 180).toBeTruthy();
    });

    it('check: name ruler', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const v of LineCommand) {
            const {
                keyRawName,
                body,
                exp,
                diag,
                recommended,
                upName,
            } = v;
            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = diag !== undefined && recommended;
            if (v1 || v2 || v3 || v4 || v5) {
                errState++;
                console.error(
                    '--86--32--51--78--64',
                    {
                        v1,
                        v2,
                        v3,
                        v4,
                        v5,
                        upName,
                        v,
                    },
                );
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });

    it('check EDiagCode.OtherCommandErr', (): void => {
        expect.hasAssertions();

        type TCommandErr = {
            reg: RegExp;
            code: EDiagCode;
        };
        const headMatch: TCommandErr[] = [
            {
                reg: /^EnvDiv$/ui,
                code: EDiagCode.code803,
            },
            {
                reg: /^EnvMult$/ui,
                code: EDiagCode.code804,
            },
            {
                reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/ui,
                code: EDiagCode.code806,
            },
            {
                reg: /^SplashImage|Progress$/ui,
                code: EDiagCode.code813,
            },
            {
                reg: /^SetEnv$/ui,
                code: EDiagCode.code814,
            },
            {
                reg: /^SetFormat$/ui,
                code: EDiagCode.code815,
            },
            {
                reg: /^SplashText(?:On|Off)$/ui,
                code: EDiagCode.code816,
            },
            {
                reg: /^Transform$/ui,
                code: EDiagCode.code824,
            },
            {
                reg: /^OnExit$/ui,
                code: EDiagCode.code812,
            },
            // Reg,,,... i need to Count colon  ??
            // New: RegRead, OutputVar, KeyName , ValueName
            // Old: RegRead, OutputVar, RootKey, SubKey , ValueName
        ];

        let errState = 0;
        for (const v of LineCommand) {
            const { diag, keyRawName } = v;

            const find: TCommandErr | undefined = headMatch
                .find((element: TCommandErr): boolean => element.reg.test(keyRawName));

            if (find === undefined) continue; // miss

            const { code } = find;

            if ((diag === undefined || diag !== code)) {
                errState++;
                console.error('--86--39--126', { keyRawName, find });
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });

    it('check: command param naming rules', () => {
        expect.hasAssertions();

        const errList2: string[] = [];
        const errList3: string[] = [];
        const errList4: string[] = [];
        const errList5: string[] = [];
        for (const v of LineCommand) {
            const { body, keyRawName, _paramType } = v;
            const def: string[] = _paramType;

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

    it('check: tmLanguage', () => {
        expect.hasAssertions();

        const tsData = LineCommand
            .map((v) => v.keyRawName)
            .join('|');

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const st1 = (tmLanguage.repository.command.patterns.at(-1)!.begin)
            .replace('(?:^|[ \\t:])\\b(?i:', '')
            .replace(')\\b(?!\\()', '');

        // eslint-disable-next-line no-magic-numbers
        expect(tsData === st1).toBeTruthy();
    });
});
