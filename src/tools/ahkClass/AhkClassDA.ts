import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../../globalEnum';
import { TClassMeta } from './TAhkClassDA';

function getClassDACore(
    document: vscode.TextDocument,
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): null | TClassMeta {
    return null;
}

function getClassDAList(
    document: vscode.TextDocument,
    AhkSymbolList: TAhkSymbolList,
    DocStrMap: TTokenStream,
): TClassMeta[] {
    const classMetaList: TClassMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind !== vscode.SymbolKind.Class) continue;

        const DA: null | TClassMeta = getClassDACore(document, AhkSymbol, DocStrMap);
        if (DA !== null) classMetaList.push(DA);
    }

    return classMetaList;
}
