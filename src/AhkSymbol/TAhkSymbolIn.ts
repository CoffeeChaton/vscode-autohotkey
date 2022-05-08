import * as vscode from 'vscode';
import { CAhkClass } from './CAhkClass';
import { CAhkClassGetSet } from './CAhkClassGetSet';
import { CAhkClassInstanceVar } from './CAhkClassInstanceVar';
import { CAhkComment } from './CAhkComment';
import { CAhkFunc } from './CAhkFunc';
import { CAhkHotKeys } from './CAhkHotKeys';
import { CAhkHotString } from './CAhkHotString';
import { CAhkInclude } from './CAhkInclude';
import { CAhkLabel } from './CAhkLabel';
import { CAhkCase, CAhkDefault, CAhkSwitch } from './CAhkSwitch';

export type TAhkSymbol =
    | vscode.DocumentSymbol // TODO: remove this
    | CAhkClass
    | CAhkClassGetSet
    | CAhkClassInstanceVar
    | CAhkComment
    | CAhkFunc
    | CAhkHotKeys
    | CAhkHotString
    | CAhkInclude
    | CAhkLabel
    | CAhkSwitch
    | CAhkCase
    | CAhkDefault;
export type TAhkSymbolList = TAhkSymbol[];
