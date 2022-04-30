import * as path from 'path';
import { CAhkFuncSymbol, TTokenStream } from '../../globalEnum';
import {
    BuiltInFunctionObj,
    TBuiltInFuncElement,
    TUPKey,
    UPKeyList,
} from '../../tools/Built-in/func';
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

function splitLine(keyUp: string, fullFuncMap: TFullFuncMap): string {
    const DA: CAhkFuncSymbol | undefined = fullFuncMap.get(keyUp);
    if (DA !== undefined) {
        const fileName: string = path.basename(DA.uri.fsPath);
        return `${DA.name}(...) ; ${fileName}`;
    }

    const UPKey: TUPKey | undefined = UPKeyList.find((v: TUPKey) => v === keyUp);
    if (UPKey !== undefined) {
        const BuiltInFunc: TBuiltInFuncElement = BuiltInFunctionObj[UPKey];
        return `${BuiltInFunc.keyRawName}(...) ; "Built-in Functions"`;
    }

    // else
    return `${keyUp}(...) ; >>>>>>>>>>>>>> unknown function <<<<<<<<<<<<<<<<<<<`;
}

export function AnalyzeRefFunc(AhkTokenList: TTokenStream, fullFuncMap: TFullFuncMap): string[] {
    const refFuncMap: TRefFuncInfoMap = getRefFuncMap(AhkTokenList);

    if (refFuncMap.size === 0) return [];

    const ed: string[] = [
        '/**',
        '* @Analyze Function',
        '* > read more of [Built-in Functions](https://www.autohotkey.com/docs/Functions.htm#BuiltIn)',
        '*/',
        'loop, 0 {',
    ];

    for (const [keyUp, MsgList] of refFuncMap) {
        ed.push(
            splitLine(keyUp, fullFuncMap),
            ...MsgList.map((Msg: TMsg): string => `; ln ${Msg.line + 1} ;    ${Msg.textRaw.trim()}`),
            '',
        );
    }

    ed.pop();
    ed.push('}');
    ed.push('');
    return ed;
}
