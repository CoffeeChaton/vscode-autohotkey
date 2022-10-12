import type { TTextMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { C506Class } from '../../../../provider/Diagnostic/tools/CDiagFnLib/C506Class';

export function C506DiagNumberStyle(textMap: TTextMapOut, code506List: C506Class[]): void {
    for (const [keyUpName, v] of textMap) {
        if ((/^0o[0-7]+$/ui).test(keyUpName) || (/^0b[0-1]+$/ui).test(keyUpName)) {
            for (const range of v.refRangeList) {
                code506List.push(
                    new C506Class({
                        range,
                        keyUpName,
                    }),
                );
            }
        }
    }
}
