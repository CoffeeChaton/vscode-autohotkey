import * as vscode from 'vscode';
import { MyDocSymbol, TDocArr } from '../../globalEnum';
import { EFnMode } from './ahkFucObj';

// is https://www.autohotkey.com/docs/Functions.htm#Local
export function getFnMode(docSymbol: MyDocSymbol | vscode.DocumentSymbol, DocStrMap: TDocArr): EFnMode {
    const start = docSymbol.selectionRange.end.line;
    const end = start + 5;
    for (let i = start; i < end; i++) {
        if ((/^\s*local\s*$/i).test(DocStrMap[i].lStr)) return EFnMode.local;
        if ((/^\s*global\s*$/i).test(DocStrMap[i].lStr)) return EFnMode.global;
        if ((/^\s*Static\s*$/i).test(DocStrMap[i].lStr)) return EFnMode.Static;
    }

    return EFnMode.normal;
}
