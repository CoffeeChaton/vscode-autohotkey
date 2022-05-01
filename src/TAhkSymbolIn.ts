import * as vscode from 'vscode';
import { CAhkClass } from './CAhkClass';
import { CAhkFunc } from './CAhkFunc';
import { DeepReadonly } from './globalEnum';

export type TAhkSymbolIn = DeepReadonly<vscode.DocumentSymbol>;
export type TAhkSymbol = DeepReadonly<TAhkSymbolIn | CAhkFunc | CAhkClass>;
export type TAhkSymbolList = DeepReadonly<TAhkSymbol[]>;
