import * as vscode from 'vscode';
import { CAhkHotKeys } from './AhkSymbol/CAhkHotKeys';
import { CAhkHotString } from './AhkSymbol/CAhkHotString';
import { CAhkInclude } from './AhkSymbol/CAhkInclude';
import { CAhkLabel } from './AhkSymbol/CAhkLabel';
import { CAhkClass } from './CAhkClass';
import { CAhkFunc } from './CAhkFunc';
import { DeepReadonly } from './globalEnum';

export type TAhkSymbolIn = DeepReadonly<vscode.DocumentSymbol>; // TODO: remove this
type TList =
    | CAhkFunc
    | CAhkClass
    | CAhkInclude
    | CAhkInclude
    | CAhkLabel
    | CAhkHotString
    | CAhkHotKeys;

export type TAhkSymbol = DeepReadonly<TAhkSymbolIn | TList>;
export type TAhkSymbolList = DeepReadonly<TAhkSymbol[]>;
