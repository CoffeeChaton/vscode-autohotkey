/* eslint-disable no-param-reassign */

export type TAhkBaseObj = {
    ahkArray: boolean;
    ahkFileOpen: boolean;
    ahkFuncObject: boolean;
    ahkBase: boolean;
};

export function ahkBaseUp(strPart: string, Obj: TAhkBaseObj): TAhkBaseObj {
    if (!Obj.ahkFileOpen && (/^FileOpen\(/i).test(strPart)) {
        Obj.ahkFileOpen = true;
        Obj.ahkBase = true;
        return Obj;
    }
    if (!Obj.ahkFuncObject && (/^Func\(/i).test(strPart)) {
        Obj.ahkFuncObject = true;
        Obj.ahkBase = true;
        return Obj;
    }
    if (!Obj.ahkArray && (strPart.startsWith('[') || (/^Array\(/i).test(strPart))) {
        Obj.ahkArray = true;
        Obj.ahkBase = true;
        return Obj;
    }
    if (!Obj.ahkArray && (strPart.startsWith('{') || (/^Object\(/i).test(strPart))) {
        Obj.ahkBase = true;
        return Obj;
    }
    // := RegExMatch(Haystack, NeedleRegEx  https://www.autohotkey.com/docs/commands/RegExMatch.htm#MatchObject
    // NeedleRegEx = "O)"

    return Obj;
}
