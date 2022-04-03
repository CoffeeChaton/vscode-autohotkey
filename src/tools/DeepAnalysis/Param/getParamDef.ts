import * as vscode from 'vscode';
import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { TArgAnalysis, TArgMap } from '../FnMetaType';

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
    const isVariadic: boolean = param.endsWith('*'); // https://ahkde.github.io/docs/Functions.htm#Variadic
    const keyRawName: string = isVariadic
        ? key0.replace(/\*$/u, '')
        : key0;
    return {
        isByRef,
        isVariadic,
        keyRawName,
    };
}

function getParamDefNeed(param: string, funcRawName: string, line: number, lStr: string): TArgAnalysis {
    const data = getKeyRawName(param);
    const { isByRef, isVariadic, keyRawName } = data;
    if (!(/^\w+$/u).test(keyRawName)) {
        const errCode = '--99--37--21--';
        const errMsg = 'DeepAnalysis NekoHelp Unknown Syntax of ';
        const errLoc = `${funcRawName}() line : ${line + 1}`;
        const message = `${errMsg} args Error ${keyRawName}${errCode}${errLoc}`;
        console.error('🚀 getParamDef ~ message', message);
        void vscode.window.showErrorMessage(message);
        throw new Error(message);
    }

    // eslint-disable-next-line security/detect-non-literal-regexp
    const character: number = lStr.search(new RegExp(`\\b${keyRawName}\\b`, 'u'));

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + keyRawName.length),
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

export function getParamDef(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
    const argMap: TArgMap = new Map<string, TArgAnalysis>();
    const startLine: number = ahkSymbol.selectionRange.start.line;
    const endLine: number = ahkSymbol.selectionRange.end.line;
    const funcRawName: string = ahkSymbol.name;
    for (const { lStr, line } of DocStrMap) {
        if (line > endLine) break;
        let lStrFix: string = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w+\(/u, '');
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/u, '');

        const strList: string[] = lStrFix
            .replace(/:?=\s*[-+.\w]+/ug, '') // Test 0x00ffffff  , -0.5 , 0.8
            .split(',')
            .map((v: string): string => v.trim());

        for (const param of strList) {
            if (param === '') continue;
            const ArgAnalysis: TArgAnalysis = getParamDefNeed(param, funcRawName, line, lStr);
            const key: string = ArgAnalysis.keyRawName.toUpperCase();
            argMap.set(key, ArgAnalysis);
        }
    }

    return argMap;
}
