import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from './CDiagBase';
import { assignErr } from './lineErr/assignErr';
import { getCommandErr } from './lineErr/getCommandErr';

export function getLineErr(DocStrMap: TTokenStream): CDiagBase[] {
    const errList: CDiagBase[] = [];

    for (const token of DocStrMap) {
        if (!token.displayErr) continue;

        const ed1: CDiagBase | null = assignErr(token, DocStrMap);
        if (ed1 !== null) errList.push(ed1);

        const ed2: CDiagBase | null = getCommandErr(token);
        if (ed2 !== null) errList.push(ed2);
    }

    return errList;
}
