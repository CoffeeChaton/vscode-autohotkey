/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import { OnigScanner, OnigString } from 'vscode-oniguruma';
import { TTokenStream } from '../../globalEnum';

export type FuncDefData = {
    name: string;
    selectionRange: vscode.Range;
};

type FuncTailType = { DocStrMap: TTokenStream; searchText: string; name: string; searchLine: number; defLine: number };

function getSelectionRange(DocStrMap: TTokenStream, defLine: number, searchLine: number): vscode.Range {
    // const argPos = Math.max(DocStrMap[defLine].lStr.indexOf('('), 0);
    const colS = DocStrMap[defLine].lStr.search(/\w/);
    const colE = DocStrMap[searchLine].lStr.lastIndexOf(')');
    //  const colFixE = colE === -1 ? DocStrMap[searchLine].lStr.length : colE;
    return new vscode.Range(
        defLine,
        colS,
        searchLine,
        colE + 1,
    );
}

function getFuncTail({
    DocStrMap,
    searchText,
    name,
    searchLine,
    defLine,
}: FuncTailType): false | FuncDefData {
    // i+1   ^, something , something ........ ) {$
    if ((/\)\s*{\s*$/).test(searchText)) {
        const selectionRange = getSelectionRange(DocStrMap, defLine, searchLine);
        return { name, selectionRange };
    }
    if (searchLine + 1 === DocStrMap.length) return false;

    // i+1   ^, something , something ......)$
    // i+2   ^{
    if (
        (/\)\s*$/).test(searchText)
        && (/^\s*{/).test(DocStrMap[searchLine + 1].lStr)
    ) {
        const selectionRange = getSelectionRange(DocStrMap, defLine, searchLine);
        return { name, selectionRange };
    }

    return false;
}

export function getFuncDef(DocStrMap: TTokenStream, defLine: number): false | FuncDefData {
    if (defLine + 1 === DocStrMap.length) return false;
    const textFix = DocStrMap[defLine].lStr;
    // if ((/^\s*\b(?:if|while)\b/i).test(textFix)) return false;

    if (textFix.indexOf('0Oネコ猫貓고양이 (') > -1) { // test onig
        const scanner = new OnigScanner(['^\\s*(\\w+)\\(']);
        const str = new OnigString(DocStrMap[defLine].textRaw);

        const ed = scanner.findNextMatchSync(str, 0);
        if (ed) {
            const { start } = ed.captureIndices[1];
            console.log('🚀 ~ getFuncDef ~ ed start', start);
        }
    }

    const fnHead = (/^\s*(\w\w*)\(/).exec(textFix); //  funcName(...
    if (fnHead === null) return false;

    const name = fnHead[1];
    if ((/^(?:if|while)$/i).test(name)) return false;

    const funcData = getFuncTail({
        DocStrMap,
        searchText: textFix,
        name,
        searchLine: defLine,
        defLine,
    });
    if (funcData) return funcData;

    if (DocStrMap[defLine].lStr.includes(')')) return false; // fn_Name( ... ) ...  ,this is not ahk function

    const iMax = Math.min(defLine + 15, DocStrMap.length);
    for (let searchLine = defLine + 1; searchLine < iMax; searchLine++) {
        const searchText = DocStrMap[searchLine].lStr;

        if (!(/^\s*,/).test(searchText)) return false;

        const funcData2 = getFuncTail({
            DocStrMap,
            searchText,
            name,
            searchLine,
            defLine,
        });
        if (funcData2) return funcData2;
    }
    return false;
}
