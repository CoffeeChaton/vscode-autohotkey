import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../../globalEnum';
import { TClassMeta, TNode } from './TAhkClassDA';

function getClassDACore(
    document: vscode.TextDocument,
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    Node: TNode,
): null | TClassMeta {
    return null;
}

function getClassDAList(
    document: vscode.TextDocument,
    AhkSymbolList: TAhkSymbolList,
    DocStrMap: TTokenStream,
    Node: TNode,
): TClassMeta[] {
    const classMetaList: TClassMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind !== vscode.SymbolKind.Class) continue;

        const DA: null | TClassMeta = getClassDACore(document, AhkSymbol, DocStrMap, Node);
        if (DA !== null) classMetaList.push(DA);
    }

    return classMetaList;
}
