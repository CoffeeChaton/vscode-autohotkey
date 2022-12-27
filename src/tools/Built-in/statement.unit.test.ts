import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { Statement } from './statement.data';

/**
 * Capitalize<Lowercase<str>>;
 */
function CapitalizeLowercase(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function isAllowList(keyRawName: string, upName: string): boolean {
    if (keyRawName.startsWith('If')) return false;
    if (
        [
            'ExitApp',
            'GoSub',
        ].includes(keyRawName)
    ) {
        return false;
    }
    return keyRawName !== CapitalizeLowercase(upName);
}

describe('check Statement ruler', () => {
    it('exp: and or break if return', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const v of Statement) {
            const {
                keyRawName,
                body,
                exp,
                upName,
            } = v;

            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = isAllowList(keyRawName, upName);
            if (v1 || v2 || v3 || v4 || v5) {
                errState++;
                console.error(
                    '--15--36--49--76--56',
                    {
                        v1,
                        v2,
                        v3,
                        v4,
                        upName,
                        v,
                    },
                );
                break;
            }
        }

        expect(errState === 0).toBeTruthy();
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const arr1: string[] = Statement.map((v): string => v.keyRawName);

        const st1: string = (repository.flow_of_control.patterns.at(-1)?.match ?? '')
            .replace('\\b(?!MsgBox)(?<![.#])(?i:', '')
            .replace(')\\b', '');

        expect(st1 === arr1.join('|')).toBeTruthy();
    });
});
