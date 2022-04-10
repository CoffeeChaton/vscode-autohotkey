import * as vscode from 'vscode';
import { msgWithPos } from '../../command/ListAllFunc';
import { TFsPath, TTokenStream } from '../../globalEnum';
import { BuiltInFunctionMap, TBuiltInFuncElement } from '../../tools/Built-in/func';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { OutputChannel as out } from '../vscWindows/OutputChannel';

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

function splitLine(keyUp: string, fullFuncMap: TFullFuncMap): void {
    const DA: TDAMeta | undefined = fullFuncMap.get(keyUp);
    if (DA !== undefined) {
        out.appendLine(msgWithPos(`${DA.funcRawName}(...)`, DA.uri.fsPath, DA.range.start));
        return;
    }
    const BuiltInFunc: TBuiltInFuncElement | undefined = BuiltInFunctionMap.get(keyUp);
    if (BuiltInFunc !== undefined) {
        out.appendLine(`${BuiltInFunc.keyRawName}(...) of "Built-in Functions" ; ${BuiltInFunc.link}`);
        return;
    }
    // else
    out.appendLine(`${keyUp}(...) of unknown function`);
}

function printRefFunc(fsPath: string, MsgList: TMsg[]): void {
    for (const Msg of MsgList) {
        const startPos: vscode.Position = new vscode.Position(Msg.line, 0);
        out.appendLine(msgWithPos(`    ${Msg.textRaw.trim()}`, fsPath, startPos));
    }
}

export function refFuncAnalyze(AhkTokenList: TTokenStream, fsPath: TFsPath, fullFuncMap: TFullFuncMap): void {
    const refFuncMap: TRefFuncInfoMap = getRefFuncMap(AhkTokenList);

    if (refFuncMap.size === 0) return;

    const arrayObj: [string, TMsg[]][] = Array.from(refFuncMap);
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    arrayObj.sort();

    out.appendLine('"--- ref Function Analyze Start ---"');
    out.appendLine('');
    for (const [keyUp, MsgList] of arrayObj) {
        splitLine(keyUp, fullFuncMap);
        printRefFunc(fsPath, MsgList);
        out.appendLine('');
    }

    out.appendLine('; Built-in Functions');
    out.appendLine('; https://www.autohotkey.com/docs/Functions.htm#BuiltIn');
    out.appendLine('"--- ref Function Analyze End ---"');
}
