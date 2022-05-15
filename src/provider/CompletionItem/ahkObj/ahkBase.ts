/* eslint-disable no-param-reassign */

export type TAhkBaseObj = {
    ahkArray: boolean;
    ahkFileOpen: boolean;
    ahkFuncObject: boolean;
    ahkBase: boolean;
};

export function ahkBaseUp(strPart: string, Obj: TAhkBaseObj): TAhkBaseObj {
    // fileOpen() https://www.autohotkey.com/docs/commands/FileOpen.htm
    // file := FileOpen(Filename, Flags , Encoding)
    //          ^
    if (!Obj.ahkFileOpen && (/^FileOpen\(/ui).test(strPart)) {
        Obj.ahkFileOpen = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/commands/Func.htm
    // FunctionReference := Func(FunctionName)
    //                       ^
    if (!Obj.ahkFuncObject && (/^Func\(/iu).test(strPart)) {
        Obj.ahkFuncObject = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/commands/Array.htm
    // Array := [Item1, Item2, ..., ItemN]
    //          ^ ; this `[`
    if (!Obj.ahkArray && (strPart.startsWith('[') || (/^Array\(/ui).test(strPart))) {
        Obj.ahkArray = true;
        Obj.ahkBase = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/Objects.htm#Usage_Freeing_Objects
    // obj := {}  ; Creates an object.
    //        ^ ; this `{'
    if (!Obj.ahkArray && (strPart.startsWith('{') || (/^Object\(/ui).test(strPart))) {
        Obj.ahkBase = true;
        return Obj;
    }
    // := RegExMatch(Haystack, NeedleRegEx  https://www.autohotkey.com/docs/commands/RegExMatch.htm#MatchObject
    // NeedleRegEx = "O)"

    return Obj;
}
