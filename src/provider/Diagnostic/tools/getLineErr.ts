import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';
import { assignErr } from './lineErr/assignErr';
import { getCommandErr } from './lineErr/getCommandErr';
import { getObjBaseErr } from './lineErr/getObjBaseErr';
import type { TLineDiag, TLineErrDiagParam } from './lineErr/lineErrTools';
import { EDiagLine } from './lineErr/lineErrTools';

function getLineErrCore(lStr: string, fistWordUp: string, line: number): CDiagBase | null {
    const lStrTrim: string = lStr.trim();
    if (lStrTrim === '') return null;

    type TFnLineErr = (parm: TLineErrDiagParam) => TLineDiag;
    const fnList: TFnLineErr[] = [getObjBaseErr, getCommandErr];
    for (const fn of fnList) {
        const err: TLineDiag = fn({
            lStr,
            lStrTrim,
            fistWordUp,
            line,
        });

        if (err === EDiagLine.OK) return null; // OK

        if (err !== EDiagLine.miss) { // err
            return err;
        }
        // err=== EDiagLine.miss
    }
    return null;
}

export function getLineErr(DocStrMap: TTokenStream, line: number): CDiagBase | null {
    const {
        textRaw,
        lStr,
        detail,
        fistWordUp,
    } = DocStrMap[line];
    const err0: CDiagBase | null = assignErr(textRaw, detail, line);
    if (err0 !== null) return err0;

    return getLineErrCore(lStr, fistWordUp, line);
}
