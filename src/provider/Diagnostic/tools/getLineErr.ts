import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';
import { assignErr } from './lineErr/assignErr';
import { getCommandErr } from './lineErr/getCommandErr';
import { getObjBaseErr } from './lineErr/getObjBaseErr';

export function getLineErr(DocStrMap: TTokenStream): CDiagBase[] {
    const errList: CDiagBase[] = [];

    type TFn = (params: TAhkTokenLine) => CDiagBase | null;
    const fnList: TFn[] = [getObjBaseErr, getCommandErr];

    for (const token of DocStrMap) {
        if (!token.displayErr) continue;

        const ed1: CDiagBase | null = assignErr(token, DocStrMap);
        if (ed1 !== null) errList.push(ed1);

        for (const fn of fnList) {
            const ed: CDiagBase | null = fn(token);
            if (ed !== null) errList.push(ed);
        }
    }

    return errList;
}
