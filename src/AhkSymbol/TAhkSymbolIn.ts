import { CAhkClass, CAhkClassGetSet, CAhkClassInstanceVar } from './CAhkClass';
import { CAhkFunc } from './CAhkFunc';
import { TLineClass } from './CAhkLine';
import { CAhkCase, CAhkDefault, CAhkSwitch } from './CAhkSwitch';

export type TAhkSymbol =
    | CAhkCase
    | CAhkClass
    | CAhkClassGetSet
    | CAhkClassInstanceVar
    | CAhkDefault
    | CAhkFunc
    | CAhkSwitch
    | TLineClass;

export type TAhkSymbolList = TAhkSymbol[];
