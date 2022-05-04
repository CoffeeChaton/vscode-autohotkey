import * as vscode from 'vscode';
import { DeepReadonly } from '../globalEnum';
import { CAhkClass } from './CAhkClass';
import { CAhkFunc } from './CAhkFunc';
import { CAhkHotKeys } from './CAhkHotKeys';
import { CAhkHotString } from './CAhkHotString';
import { CAhkInclude } from './CAhkInclude';
import { CAhkLabel } from './CAhkLabel';

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
