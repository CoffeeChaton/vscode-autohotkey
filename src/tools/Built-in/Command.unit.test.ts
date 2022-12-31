/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { EDiagCode } from '../../diag';
import { LineCommand } from './Command.data';

describe('check LineCommand ruler', () => {
    const max = 180;

    it(`check: Command size .EQ. ${max}`, () => {
        expect.hasAssertions();

        expect(LineCommand).toHaveLength(max);
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

        expect(errState).toBe(0);
    });

    it('check EDiagCode.OtherCommandErr', (): void => {
        expect.hasAssertions();

        type TCommandErr = {
            reg: RegExp;
            code: EDiagCode;
        };
        const headMatch: TCommandErr[] = [
            {
                reg: /^EnvDiv$/iu,
                code: EDiagCode.code803,
            },
            {
                reg: /^EnvMult$/iu,
                code: EDiagCode.code804,
            },
            {
                reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/iu,
                code: EDiagCode.code806,
            },
            {
                reg: /^SplashImage|Progress$/iu,
                code: EDiagCode.code813,
            },
            {
                reg: /^SetEnv$/iu,
                code: EDiagCode.code814,
            },
            {
                reg: /^SetFormat$/iu,
                code: EDiagCode.code815,
            },
            {
                reg: /^SplashText(?:On|Off)$/iu,
                code: EDiagCode.code816,
            },
            {
                reg: /^Transform$/iu,
                code: EDiagCode.code824,
            },
            {
                reg: /^OnExit$/iu,
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

        expect(errState).toBe(0);
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
            const maList: RegExpMatchArray[] = [...body.matchAll(/\$\{\d+[|:]([^}]+)\}/gu)];
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

        expect(errList2).toStrictEqual([]);
        expect(errList3).toStrictEqual([]);
        expect(errList4).toStrictEqual([]);
        expect(errList5).toStrictEqual([]);
    });

    it('check: tmLanguage', () => {
        expect.hasAssertions();

        const tsData = LineCommand
            .map((v) => v.keyRawName)
            .join('|');

        const st1 = (repository.command.patterns.at(-1)?.begin ?? '')
            .replace('(?:^|[ \\t:])\\b(?i:', '')
            .replace(')\\b(?!\\()', '');

        expect(tsData).toBe(st1);
    });
});
