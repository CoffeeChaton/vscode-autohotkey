import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgAnalysis,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { ahkValRegex } from '../../regexTools';
import { replacerSpace } from '../../removeSpecialChar';

function getNeed(param: string, uri: vscode.Uri, line: number, lStr: string): null | TArgAnalysis {
    const isByRef = (/^ByRef\s+/ui).test(param);
    const key0 = isByRef
        ? param.replace(/^ByRef\s+/ui, '')
        : param;
    if (key0 === '') return null;
    const isVariadic = (/^\w+\*$/u).test(param); // https://ahkde.github.io/docs/Functions.htm#Variadic
    const keyRawName = isVariadic
        ? key0.replace(/\*$/u, '')
        : key0;
    if (!(/^\w+$/u).test(keyRawName)) {
        const errCode = '--99--37--21--';
        const errMsg = 'DeepAnalysis NekoHelp Unknown Syntax of ';
        const errLoc = `${uri.fsPath} line : ${line + 1}`;
        const message = `${errMsg} args Error ${keyRawName}${errCode}${errLoc}`;
        console.error('🚀 getParamDef ~ message', message);
        void vscode.window.showErrorMessage(message);
        throw new Error(message);
    }

    // just keyRawName now
    const character = lStr.search(ahkValRegex(keyRawName));
    const range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + keyRawName.length),
    );
    return {
        keyRawName,
        defLocList: [new vscode.Location(uri, range)],
        refLocList: [],
        isByRef,
        isVariadic,
        c502Array: [0],
    };
}

export function getParamDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
    const argMap: TArgMap = new Map<string, TArgAnalysis>();
    const startLine = ahkSymbol.selectionRange.start.line;
    const endLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line > endLine) break;
        let lStrFix = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w+\(/u, '');
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/u, '');

        const strList: string[] = lStrFix
            .replace(/:?=\s*[-+.\w]+/ug, replacerSpace) // Test 0x00ffffff  , -0.5 , 0.8
            .split(',')
            .map((v) => v.trim());

        for (const param of strList) {
            const ArgAnalysis = getNeed(param, uri, line, lStr);
            if (ArgAnalysis === null) continue;

            const key = ArgAnalysis.keyRawName.toUpperCase();
            argMap.set(key, ArgAnalysis);
        }
    }

    return argMap;
}
