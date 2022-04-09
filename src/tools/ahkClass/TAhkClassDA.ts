import * as vscode from 'vscode';
import { DeepReadonly } from '../../globalEnum';

type TUpName = string;
type TRefRange = vscode.Range[];
type TThisMap = Map<TUpName, TRefRange>;
export type TClassMeta = DeepReadonly<{
    kind: vscode.SymbolKind.Class;
    thisMap: TThisMap;
    funcRawName: string;
    upName: string;
    selectionRangeText: string;
    range: vscode.Range; // copy ?
    // md: vscode.MarkdownString;
}>;
