import { CAhkClass, CAhkClassGetSet, CAhkClassInstanceVar } from './CAhkClass';
import { CAhkFunc } from './CAhkFunc';
import { CAhkComment, TLineClass } from './CAhkLine';
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

export type TTopSymbol = CAhkClass | CAhkFunc | CAhkSwitch | TLineClass | CAhkComment;

export type TAhkSymbolList = TAhkSymbol[];
