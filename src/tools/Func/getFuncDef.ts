import * as vscode from 'vscode';
import { TDocArr } from '../../globalEnum';

export type FuncDefData = {
    name: string;
    selectionRange: vscode.Range;
};

function lineText(DocStrMap: TDocArr, searchLine: number): string {
    return DocStrMap[searchLine].lStr;
}

type FuncTailType = { DocStrMap: TDocArr, searchText: string, name: string, searchLine: number, defLine: number };

function getSelectionRange(DocStrMap: TDocArr, defLine: number, searchLine: number): vscode.Range {
    // const argPos = Math.max(DocStrMap[defLine].lStr.indexOf('('), 0);
    const colS = Math.max(DocStrMap[defLine].lStr.search(/\S/) - 1, 0);

    const colE = DocStrMap[searchLine].lStr.lastIndexOf(')');
    //  const colFixE = colE === -1 ? DocStrMap[searchLine].lStr.length : colE;
    return new vscode.Range(
        defLine, colS,
        searchLine, colE + 1,
    );
}

function getFuncTail({
    DocStrMap, searchText, name, searchLine, defLine,
}: FuncTailType): false | FuncDefData {
    // i+1   ^, something , something ........ ) {$
    if ((/\)\s*\{\s*$/).test(searchText)) {
        const selectionRange = getSelectionRange(DocStrMap, defLine, searchLine);
        return { name, selectionRange };
    }
    if (searchLine + 1 === DocStrMap.length) return false;

    // i+1   ^, something , something ......)$
    // i+2   ^{
    if ((/\)\s*$/).test(searchText)
        && (/^\s*\{/).test(lineText(DocStrMap, searchLine + 1))) {
        const selectionRange = getSelectionRange(DocStrMap, defLine, searchLine);
        return { name, selectionRange };
    }

    return false;
}

export function getFuncDef(DocStrMap: TDocArr, defLine: number): false | FuncDefData {
    if (defLine + 1 === DocStrMap.length) return false;
    const textFix = lineText(DocStrMap, defLine);
    // if ((/^\s*\b(?:if|while)\b/i).test(textFix)) return false;

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

    if (lineText(DocStrMap, defLine).includes(')')) return false;// fn_Name( ... ) ...  ,this is not ahk function

    // eslint-disable-next-line no-magic-numbers
    const iMax = Math.min(defLine + 15, DocStrMap.length);
    for (let searchLine = defLine + 1; searchLine < iMax; searchLine += 1) {
        const searchText = lineText(DocStrMap, searchLine);

        if ((/^\s*,/).test(searchText) === false) return false;

        const funcData2 = getFuncTail({
            DocStrMap, searchText, name, searchLine, defLine,
        });
        if (funcData2) return funcData2;
    }
    return false;
}
