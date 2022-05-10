import * as vscode from 'vscode';
import { TParamMapIn, TParamMetaIn } from '../../AhkSymbol/CAhkFunc';
import { TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../str/removeSpecialChar';

type TParamData = {
    isByRef: boolean;
    isVariadic: boolean;
    keyRawName: string;
};

function getKeyRawName(param: string): TParamData {
    const isByRef: boolean = (/^ByRef\s+/ui).test(param);
    const key0: string = isByRef
        ? param.replace(/^ByRef\s+/ui, '')
        : param;
    const isVariadic: boolean = param.endsWith('*'); // https://www.autohotkey.com/docs/Functions.htm#Variadic
    const keyRawName: string = isVariadic
        ? key0.replace(/\*$/u, '')
        : key0;
    return {
        isByRef,
        isVariadic,
        keyRawName,
    };
}

function checkParam(keyRawName: string, funcRawName: string, line: number): void {
    if (!(/^\w+$/u).test(keyRawName)) {
        const errCode = '--99--37--21--';
        const errMsg = 'DeepAnalysis NekoHelp Unknown Syntax of ';
        const errLoc = `${funcRawName}() line : ${line + 1}`;
        const message = `${errMsg} args Error ${keyRawName}${errCode}${errLoc}`;
        console.error('🚀 getParamDef ~ message', message);
        // void vscode.window.showErrorMessage(message);
        // throw new Error(message);
    }
}

function getParamDefNeed(param: string, funcRawName: string, line: number, ch: number): TParamMetaIn {
    const data: TParamData = getKeyRawName(param);
    const { isByRef, isVariadic, keyRawName } = data;
    checkParam(keyRawName, funcRawName, line);

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, ch),
        new vscode.Position(line, ch + keyRawName.length),
    );
    return {
        keyRawName,
        defRangeList: [range],
        refRangeList: [],
        isByRef,
        isVariadic,
        c502Array: [0],
    };
}

export function getParamDef(fnName: string, selectionRange: vscode.Range, DocStrMap: TTokenStream): TParamMapIn {
    // 113 ms self time
    const paramMap: TParamMapIn = new Map<string, TParamMetaIn>();
    const startLine: number = selectionRange.start.line;
    const endLine: number = selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line < startLine) continue;
        if (line > endLine) break;
        let lStrFix: string = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w+\(/u, replacerSpace);
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/u, replacerSpace);

        if (lStrFix.trim() === '') break;

        const strF: string = lStrFix
            .replace(/:?=\s*[-+.\w]+/ug, replacerSpace); // Test 0x00ffffff  , -0.5 , 0.8

        const strF2: string = strF.replace(/\bByRef\b/uig, replacerSpace);

        for (const ma of strF.matchAll(/\s*([^,]+),?/uig)) {
            const param: string = ma[1].trim();
            if (param === '') continue;

            const find: string = param.replace(/\bByRef\b\s*/ui, '');
            const ch: number = strF2.indexOf(find, ma.index);

            const ArgAnalysis: TParamMetaIn = getParamDefNeed(param, fnName, line, ch);

            const key: string = ArgAnalysis.keyRawName.toUpperCase();
            paramMap.set(key, ArgAnalysis);
        }
    }

    return paramMap;
}
