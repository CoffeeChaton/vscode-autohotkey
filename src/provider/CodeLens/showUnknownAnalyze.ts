import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { OutputChannel as Out } from '../vscWindows/OutputChannel';

export function showUnknownAnalyze(DA: CAhkFunc): void {
    const { textMap, uri, name } = DA;
    const { fsPath } = uri;

    Out.clear();
    Out.appendLine(';---------------------------------------------');
    Out.appendLine(`;show Unknown text of ${name}()`);

    for (const TextMetaOut of textMap.values()) {
        Out.appendLine(`${TextMetaOut.keyRawName}`);
        for (const range of TextMetaOut.refRangeList) {
            const { line, character } = range.start;
            Out.appendLine(`    at line ${line + 1} ;${fsPath}:${line + 1}:${character + 1}`);
        }
    }
    Out.appendLine(';---------------------------------------------');
    Out.show();
}

export type TShowUnknownAnalyze = Parameters<typeof showUnknownAnalyze>;
