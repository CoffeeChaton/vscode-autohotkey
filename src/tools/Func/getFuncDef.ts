import * as vscode from 'vscode';
import { TTokenStream } from '../../globalEnum';

export type FuncDefData = {
    name: string;
    selectionRange: vscode.Range;
};

type FuncTailType = {
    DocStrMap: TTokenStream;
    searchText: string;
    name: string;
    searchLine: number;
    defLine: number;
};

function getFuncDefData(DocStrMap: TTokenStream, defLine: number, searchLine: number, name: string): FuncDefData {
    // const argPos = Math.max(DocStrMap[defLine].lStr.indexOf('('), 0);
    const colS: number = DocStrMap[defLine].lStr.search(/\w/u);
    const colE: number = DocStrMap[searchLine].lStr.lastIndexOf(')');
    //  const colFixE = colE === -1 ? DocStrMap[searchLine].lStr.length : colE;
    const selectionRange: vscode.Range = new vscode.Range(
        defLine,
        colS,
        searchLine,
        colE + 1,
    );
    return { name, selectionRange };
}

function getFuncTail({
    DocStrMap,
    searchText,
    name,
    searchLine,
    defLine,
}: FuncTailType): null | FuncDefData {
    // i+1   ^, something , something ........ ) {$
    if ((/\)\s*\{\s*$/u).test(searchText)) {
        return getFuncDefData(DocStrMap, defLine, searchLine, name);
    }
    if (searchLine + 1 === DocStrMap.length) return null;

    // i+1   ^, something , something ......)$
    // i+2   ^{
    if (
        (/\)\s*$/u).test(searchText)
        && (/^\s*\{/u).test(DocStrMap[searchLine + 1].lStr)
    ) {
        return getFuncDefData(DocStrMap, defLine, searchLine, name);
    }

    return null;
}

export function getFuncDef(DocStrMap: TTokenStream, defLine: number): false | FuncDefData {
    if (defLine + 1 === DocStrMap.length) return false;
    const textFix: string = DocStrMap[defLine].lStr;

    const fnHead: RegExpMatchArray | null = textFix.match(/^\s*(\w+)\(/u); //  funcName(...
    if (fnHead === null) return false;

    const name: string = fnHead[1];
    if ((/^(?:if|while)$/ui).test(name)) return false;

    const funcData: FuncDefData | null = getFuncTail({
        DocStrMap,
        searchText: textFix,
        name,
        searchLine: defLine,
        defLine,
    });
    if (funcData !== null) return funcData;

    if (DocStrMap[defLine].lStr.includes(')')) return false; // fn_Name( ... ) ...  ,this is not ahk function

    // I don't think the definition of the function will exceed 15 lines.
    // eslint-disable-next-line no-magic-numbers
    const iMax: number = Math.min(defLine + 15, DocStrMap.length);
    for (let searchLine = defLine + 1; searchLine < iMax; searchLine++) {
        const searchText: string = DocStrMap[searchLine].lStr;

        if (!(/^\s*,/u).test(searchText)) return false;

        const funcData2: FuncDefData | null = getFuncTail({
            DocStrMap,
            searchText,
            name,
            searchLine,
            defLine,
        });
        if (funcData2 !== null) return funcData2;
    }
    return false;
}
