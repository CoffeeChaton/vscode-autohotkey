import * as path from 'path';
import { CAhkFuncSymbol, TTokenStream } from '../../globalEnum';
import { BuiltInFunctionMap, TBuiltInFuncElement } from '../../tools/Built-in/func';
import { TFullFuncMap } from '../../tools/Func/getAllFunc';

type TMsg = {
    line: number;
    textRaw: string;
};
//                      keyUp       line
type TRefFuncInfoMap = Map<string, TMsg[]>;

function getRefFuncMap(AhkTokenList: TTokenStream): TRefFuncInfoMap {
    const refFuncMap: TRefFuncInfoMap = new Map();
    for (const { line, textRaw, lStr } of AhkTokenList) {
        // eslint-disable-next-line security/detect-unsafe-regex
        for (const ma of lStr.matchAll(/(?<![.`%])\b(\w+)\(/gui)) {
            const ch: number | undefined = ma.index;
            if (ch === undefined) continue;

            const RawName: string = ma[1];
            const UpName: string = RawName.toUpperCase();

            const msg: TMsg[] = refFuncMap.get(UpName) ?? [];
            msg.push({
                line,
                textRaw,
            });
            refFuncMap.set(UpName, msg);
        }
    }

    return refFuncMap;
}

function splitLine(keyUp: string, fullFuncMap: TFullFuncMap, ed: string[]): void {
    const DA: CAhkFuncSymbol | undefined = fullFuncMap.get(keyUp);
    if (DA !== undefined) {
        const fileName: string = path.basename(DA.uri.fsPath);
        ed.push(`${DA.name}(...) ; ${fileName}`);
        return;
    }
    const BuiltInFunc: TBuiltInFuncElement | undefined = BuiltInFunctionMap.get(keyUp);
    if (BuiltInFunc !== undefined) {
        ed.push(
            `${BuiltInFunc.keyRawName}(...) ; "Built-in Functions"`,
        );

        return;
    }
    // else
    ed.push(`${keyUp}(...) ; >>>>>>>>>>>>>> unknown function <<<<<<<<<<<<<<<<<<<`);
}

function printRefFunc(MsgList: TMsg[], ed: string[]): void {
    for (const Msg of MsgList) {
        ed.push(`; ln ${Msg.line + 1} ;    ${Msg.textRaw.trim()}`);
    }
}

export function refFuncAnalyze(AhkTokenList: TTokenStream, fullFuncMap: TFullFuncMap): string[] {
    const refFuncMap: TRefFuncInfoMap = getRefFuncMap(AhkTokenList);

    if (refFuncMap.size === 0) return [];

    const arrayObj: [string, TMsg[]][] = Array.from(refFuncMap);
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    arrayObj.sort(); // TODO sort by Built-in `1st`, useDef `2nd`, && sort by filename sort by funcName

    const ed: string[] = [
        '/**',
        '* @Analyze Function',
        '* read more of [Built-in Functions](https://www.autohotkey.com/docs/Functions.htm#BuiltIn)',
        '* ',
        '*/',
        'loop, 0 {',
    ];

    for (const [keyUp, MsgList] of arrayObj) {
        splitLine(keyUp, fullFuncMap, ed);
        printRefFunc(MsgList, ed);
        ed.push('');
    }

    ed.pop();
    ed.push('}');
    ed.push('');
    return ed;
}
