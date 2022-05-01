import { TTextMapOut } from '../../CAhkFunc';
import { OutputChannel as Out } from '../vscWindows/OutputChannel';

export type TShowUnknownAnalyze = [TTextMapOut, string];

export function showUnknownAnalyze(textMap: TTextMapOut, fsPath: string): void {
    Out.clear();
    Out.appendLine('---------------------------------------------');
    Out.appendLine('showUnknownAnalyze() ->');
    for (const [UpName, TextMetaOut] of textMap) {
        Out.appendLine(`${TextMetaOut.keyRawName} -> "${UpName}"`);
        for (const range of TextMetaOut.refRangeList) {
            const { line, character } = range.start;
            Out.appendLine(`    at line ${line + 1} ; ${fsPath}:${line + 1}:${character + 1}`);
        }
    }
    Out.appendLine('---------------------------------------------');
    Out.show();
}
