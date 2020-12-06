/* eslint-disable no-param-reassign */
export class CAhkBaseObj {
    public ahkArray: boolean;

    public ahkFileOpen: boolean;

    public ahkFuncObject: boolean;

    public ahkBase: boolean;

    public constructor() {
        this.ahkArray = false;
        this.ahkFileOpen = false;
        this.ahkFuncObject = false;
        this.ahkBase = false;
    }
}

export function ahkBase(strPart: string, Obj: CAhkBaseObj): CAhkBaseObj {
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
    //   strPart.startsWith('{ base:') // TODO { base: xxx
    if (!Obj.ahkArray && (strPart.startsWith('{') || (/^Object\(/i).test(strPart))) {
        // TODO ClassName := { __Get: Func("MyGet"), __Set: Func("MySet"), __Call: Func("MyCall") }
        Obj.ahkBase = true;
        return Obj;
    }
    // := RegExMatch(Haystack, NeedleRegEx  https://www.autohotkey.com/docs/commands/RegExMatch.htm#MatchObject
    // NeedleRegEx = "O)"

    return Obj;
}
