/* cSpell:disable */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

import type { DeepReadonly } from '../../globalEnum';

// https://www.autohotkey.com/docs/Functions.htm#BuiltIn

type TElementGroup =
    | '△Math'
    | 'COM'
    | 'Control'
    | 'Env'
    | 'Error'
    | 'File'
    | 'Func'
    | 'GUI'
    | 'ImageLists'
    | 'Keyboard'
    | 'Lib'
    | 'ListView'
    | 'Math'
    | 'Misc.'
    | 'Object'
    | 'StatusBar'
    | 'Str'
    | 'TreeView'
    | 'Window'; // OBJ_XX

type TBuiltInFuncElement = DeepReadonly<{
    keyRawName: string;
    group: TElementGroup;
    link: string;
    msg: string;
    insert: string;
    exp: string[];
}>;

type TUPKey =
    | 'ABS'
    | 'ACOS'
    | 'ARRAY'
    | 'ASC'
    | 'ASIN'
    | 'ATAN'
    | 'CEIL'
    | 'CHR'
    | 'COMOBJACTIVE'
    | 'COMOBJARRAY'
    | 'COMOBJCONNECT'
    | 'COMOBJCREATE'
    | 'COMOBJECT'
    | 'COMOBJENWRAP'
    | 'COMOBJERROR'
    | 'COMOBJFLAGS'
    | 'COMOBJGET'
    | 'COMOBJMISSING'
    | 'COMOBJQUERY'
    | 'COMOBJTYPE'
    | 'COMOBJUNWRAP'
    | 'COMOBJVALUE'
    | 'COS'
    | 'DLLCALL'
    | 'EXCEPTION'
    | 'EXP'
    | 'FILEEXIST'
    | 'FILEOPEN'
    | 'FLOOR'
    | 'FORMAT'
    | 'FUNC'
    | 'GETKEYNAME'
    | 'GETKEYSC'
    | 'GETKEYSTATE'
    | 'GETKEYVK'
    | 'HOTSTRING'
    | 'IL_ADD'
    | 'IL_CREATE'
    | 'IL_DESTROY'
    | 'INPUTHOOK'
    | 'INSTR'
    | 'ISBYREF'
    | 'ISFUNC'
    | 'ISLABEL'
    | 'ISOBJECT'
    | 'LN'
    | 'LOADPICTURE'
    | 'LOG'
    | 'LTRIM'
    | 'LV_ADD'
    | 'LV_DELETE'
    | 'LV_DELETECOL'
    | 'LV_GETCOUNT'
    | 'LV_GETNEXT'
    | 'LV_GETTEXT'
    | 'LV_INSERT'
    | 'LV_INSERTCOL'
    | 'LV_MODIFY'
    | 'LV_MODIFYCOL'
    | 'LV_SETIMAGELIST'
    | 'MAX'
    | 'MENUGETHANDLE'
    | 'MENUGETNAME'
    | 'MIN'
    | 'MOD'
    | 'NUMGET'
    | 'NUMPUT'
    | 'OBJADDREF'
    | 'OBJBINDMETHOD'
    | 'OBJGETBASE'
    | 'OBJRAWGET'
    | 'OBJRAWSET'
    | 'OBJRELEASE'
    | 'OBJSETBASE'
    | 'ONCLIPBOARDCHANGE'
    | 'ONERROR'
    | 'ONEXIT'
    | 'ONMESSAGE'
    | 'ORD'
    | 'REGEXMATCH'
    | 'REGEXREPLACE'
    | 'REGISTERCALLBACK'
    | 'ROUND'
    | 'RTRIM'
    | 'SB_SETICON'
    | 'SB_SETPARTS'
    | 'SB_SETTEXT'
    | 'SIN'
    | 'SQRT'
    | 'STRGET'
    | 'STRLEN'
    | 'STRPUT'
    | 'STRREPLACE'
    | 'STRSPLIT'
    | 'SUBSTR'
    | 'TAN'
    | 'TRIM'
    | 'TV_ADD'
    | 'TV_DELETE'
    | 'TV_GET'
    | 'TV_GETCHILD'
    | 'TV_GETCOUNT'
    | 'TV_GETNEXT'
    | 'TV_GETPARENT'
    | 'TV_GETPREV'
    | 'TV_GETSELECTION'
    | 'TV_GETTEXT'
    | 'TV_MODIFY'
    | 'TV_SETIMAGELIST'
    | 'VARSETCAPACITY'
    | 'WINACTIVE'
    | 'WINEXIST';

type TBuiltInFuncbj = {
    [k in TUPKey]: TBuiltInFuncElement;
};

export const BuiltInFunctionObj: DeepReadonly<TBuiltInFuncbj> = {
    ABS: {
        group: 'Math',
        keyRawName: 'Abs',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Abs',
        msg: ' Returns the absolute value of _Number_.',
        insert: 'Abs($1)',
        exp: ['MsgBox, % Abs(-1.2) ; Returns 1.2'],
    },
    ACOS: {
        group: '△Math',
        keyRawName: 'ACos',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#ACos',
        msg: ' Returns the arcsine/arccosine/arctangent in radians.',
        insert: 'ACos(${1:Number})',
        exp: [
            'number := -1.1',
            'if (number < -1 || number > 1) {',
            '   return "" ; empty string',
            '}',
            'pi := 4 * ATan(1)',
            'OutputDebug % ACos(0)       ; 1.570796',
            'OutputDebug % ACos(-1)      ; 3.141593',
            'OutputDebug % ACos(-1.1)    ; ""',
            'OutputDebug % ACos(1)       ; 0.000000',
            'OutputDebug % ACos(1.1)     ; ""',
            'OutputDebug % ACos(0.5)     ; 1.047198',
            'OutputDebug % pi            ; 3.141593',
            'OutputDebug % ACos(pi / 6)  ; 1.019727',
        ],
    },
    ARRAY: {
        group: 'Misc.',
        keyRawName: 'Array',
        link: 'https://www.autohotkey.com/docs/Objects.htm#Usage_Simple_Arrays',
        msg: ' Create an array',
        insert: 'Array($0)', // (!_tcsicmp(suffix, _T("Array")))
        exp: [
            'Array1 := [Item1, Item2, ..., ItemN]',
            'Array2 := Array(Item1, Item2, ..., ItemN)',
        ],
    },
    ASC: {
        group: 'Str',
        keyRawName: 'Asc',
        link: 'https://www.autohotkey.com/docs/commands/Asc.htm',
        msg: 'Returns the numeric value of the first byte or UTF-16 code unit in the specified string.\n\n This function returns a numeric value in the range 0 to 255 (for ANSI) or 0 to 0xFFFF (for Unicode). See [Unicode vs ANSI](https://www.autohotkey.com/docs/Compat.htm#Format) for details. If _String_ is empty, it returns 0.',
        insert: 'Asc(${1:String})',
        exp: [
            'Number := Asc(String)',
            '; Both message boxes below show 116, because only the first character is considered. ',
            'MsgBox, % Asc("t") ',
            'MsgBox, % Asc("test")',
        ],
    },
    ASIN: {
        group: '△Math',
        keyRawName: 'ASin',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#ASin',
        msg: ' Returns the arcsine/arccosine/arctangent in radians.\nIf Number is less than -1 or greater than 1, the function yields a blank result (empty string).',
        insert: 'ASin(${1:Number})',
        exp: [
            'number := -1.1',
            'if (number < -1 || number > 1) {',
            '   return "" ; empty string',
            '}',
            'pi := 4 * ATan(1)',
            'OutputDebug % ASin(0)       ;0.000000',
            'OutputDebug % ASin(-1)      ;-1.570796',
            'OutputDebug % ASin(-1.1)    ; ""',
            'OutputDebug % ASin(1)       ; 1.570796',
            'OutputDebug % ASin(1.1)     ; ""',
            'OutputDebug % ASin(0.5)     ; 0.523599',
            'OutputDebug % pi            ; 3.141593',
            'OutputDebug % ASin(pi / 6)  ; 0.551070',
        ],
    },
    ATAN: {
        group: '△Math',
        keyRawName: 'ATan',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#ATan',
        msg: ' Returns the arcsine/arccosine/arctangent in radians.',
        insert: 'ATan(${1:Number})',
        exp: [
            'pi := 4 * ATan(1)',
            'OutputDebug % pi ; 3.141593',
        ],
    },
    CEIL: {
        group: 'Math',
        keyRawName: 'Ceil',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Ceil',
        msg: ' Returns _Number_ rounded up to the nearest integer (without any .00 suffix).',
        insert: 'Ceil($1)',
        exp: [
            'MsgBox, % Ceil(1.2)  ; Returns 2',
            'MsgBox, % Ceil(-1.2) ; Returns -1',
        ],
    },
    CHR: {
        group: 'Str',
        keyRawName: 'Chr',
        link: 'https://www.autohotkey.com/docs/commands/Chr.htm',
        msg: 'Returns the string (usually a single character) corresponding to the character code indicated by the specified number.',
        insert: 'Chr(${1:Number})',
        exp: [
            'String := Chr(Number)',
            'MsgBox % Chr(116) ; Reports "t".',
        ],
    },
    COMOBJACTIVE: {
        group: 'COM',
        keyRawName: 'ComObjActive',
        link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
        msg: 'Retrieves a running object that has been registered with OLE.',
        insert: 'ComObjActive(${1:CLSID})',
        exp: ['ComObject := ComObjActive(CLSID)'],
    },
    COMOBJARRAY: {
        group: 'COM',
        keyRawName: 'ComObjArray',
        link: 'https://www.autohotkey.com/docs/commands/ComObjArray.htm',
        msg: ' Creates a SAFEARRAY for use with COM.',
        insert: 'ComObjArray(${1:VarType}, ${2:Count1})',
        exp: [
            'arr := ComObjArray(VT_VARIANT:=12, 3)',
            'arr[0] := "Auto"',
            'arr[1] := "Hot"',
            'arr[2] := "key"',
            't := ""',
            'Loop % arr.MaxIndex() + 1',
            '    t .= arr[A_Index-1]',
            'MsgBox % t',
        ],
    },
    COMOBJCONNECT: {
        group: 'COM',
        keyRawName: 'ComObjConnect',
        link: 'https://www.autohotkey.com/docs/commands/ComObjConnect.htm',
        msg: ' Connects a COM object\'s event sources to functions with a given prefix.',
        insert: 'ComObjConnect(${1:ComObject})',
        exp: [
            'ie := ComObjCreate("InternetExplorer.Application")',
            '; Connects events to corresponding script functions with the prefix "IE_".',
            'ComObjConnect(ie, "IE_")',
        ],
    },
    COMOBJCREATE: {
        group: 'COM',
        keyRawName: 'ComObjCreate',
        link: 'https://www.autohotkey.com/docs/commands/ComObjCreate.htm',
        msg: ' Creates a COM object.',
        insert: 'ComObjCreate(${1:CLSID})',
        exp: [
            'ie := ComObjCreate("InternetExplorer.Application")',
            'ie.Visible := true  ; This is known to work incorrectly on IE7.',
            'ie.Navigate("https://www.autohotkey.com/")',
        ],
    },
    COMOBJECT: {
        group: 'COM',
        keyRawName: 'ComObject',
        link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
        msg: ' Creates an object representing a typed value to be passed as a parameter or return value.',
        insert: 'ComObject(${1:VarType}, ${2:Value})',
        exp: [
            'ParamObj := ComObject(VarType, Value , Flags)',
        ],
    },
    COMOBJENWRAP: {
        group: 'COM',
        keyRawName: 'ComObjEnwrap',
        link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
        msg: ' Wraps/unwraps a COM object.',
        insert: 'ComObjEnwrap(${1:DispPtr})',
        exp: [
            ';is Deprecated',
            'ComObject := ComObjEnwrap(DispPtr)',
        ],
    },
    COMOBJERROR: {
        group: 'COM',
        keyRawName: 'ComObjError',
        link: 'https://www.autohotkey.com/docs/commands/ComObjError.htm',
        msg: ' Enables or disables notification of COM errors.',
        insert: 'ComObjError($1)',
        exp: ['Enabled := ComObjError(true)'],
    },
    COMOBJFLAGS: {
        group: 'COM',
        keyRawName: 'ComObjFlags',
        link: 'https://www.autohotkey.com/docs/commands/ComObjFlags.htm',
        msg: 'Retrieves or changes flags which control a COM wrapper object\'s behaviour.',
        insert: 'ComObjFlags(${1:ComObject})',
        exp: ['Flags := ComObjFlags(ComObject , NewFlags, Mask)'],
    },
    COMOBJGET: {
        group: 'COM',
        keyRawName: 'ComObjGet',
        link: 'https://www.autohotkey.com/docs/commands/ComObjGet.htm',
        msg: ' Returns a reference to an object provided by a COM component.',
        insert: 'ComObjGet(${1:Name})',
        exp: [
            'WinGet pid, PID, A',
            '; Get WMI service object.',
            'wmi := ComObjGet("winmgmts:")',
        ],
    },
    COMOBJMISSING: {
        group: 'COM',
        keyRawName: 'ComObjMissing',
        link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
        msg: ' Creates a "missing parameter" object to pass to a COM method.',
        insert: 'ComObjMissing($0)',
        exp: [
            '; is Deprecated',
            'ParamObj := ComObjMissing()',
        ],
    },
    COMOBJQUERY: {
        group: 'COM',
        keyRawName: 'ComObjQuery',
        link: 'https://www.autohotkey.com/docs/commands/ComObjQuery.htm',
        msg: ' Queries a COM object for an interface or service.',
        insert: 'ComObjQuery(${1:ComObject})',
        exp: ['InterfacePointer := ComObjQuery(ComObject, SID, IID)'],
    },
    COMOBJTYPE: {
        group: 'COM',
        keyRawName: 'ComObjType',
        link: 'https://www.autohotkey.com/docs/commands/ComObjType.htm',
        msg: 'Retrieves type information from a COM object.',
        insert: 'ComObjType(${2:ComObject}, "${1|Name,IID,Class,CLSID|}")',
        exp: [
            'd := ComObjCreate("Scripting.Dictionary")',
            'VarType := ComObjType(d)',
            'IName   := ComObjType(d, "Name")',
            'IID     := ComObjType(d, "IID")',
            'CName   := ComObjType(d, "Class")',
            'CLSID   := ComObjType(d, "CLSID")',
        ],
    },
    COMOBJUNWRAP: {
        group: 'COM',
        keyRawName: 'ComObjUnwrap',
        link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
        msg: ' Wraps/unwraps a COM object.',
        insert: 'ComObjUnwrap(${1:ComObject})',
        exp: [
            ';is Deprecated',
            'DispPtr := ComObjUnwrap(ComObject)',
        ],
    },
    COMOBJVALUE: {
        group: 'COM',
        keyRawName: 'ComObjValue',
        link: 'https://www.autohotkey.com/docs/commands/ComObjValue.htm',
        msg: 'Retrieves the value or pointer stored in a COM wrapper object.',
        insert: 'ComObjValue(${1:ComObject})',
        exp: ['Value := ComObjValue(ComObject)'],
    },
    COS: {
        group: '△Math',
        keyRawName: 'Cos',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Cos',
        msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        insert: 'Cos(${1:Number})',
        exp: [
            'Value := Cos(Number)',
            '',
            'MsgBox, % Cos(90) ; Returns -0.448074',
            'pi := 4 * ATan(1)',
            'MsgBox, % Cos(90*pi) ; Returns 1',
        ],
    },
    DLLCALL: {
        group: 'Lib',
        keyRawName: 'DllCall',
        link: 'https://www.autohotkey.com/docs/commands/DllCall.htm',
        msg: 'Calls a function inside a DLL, such as a standard Windows API function.',
        insert: 'DllCall($0)',
        exp: [
            'SysColor := 15',
            'bc := DllCall("GetSysColor", "Int", SysColor, "UInt")',
        ],
    },
    EXCEPTION: {
        group: 'Error',
        keyRawName: 'Exception',
        link: 'https://www.autohotkey.com/docs/commands/Throw.htm#Exception',
        msg: 'Creates an object which can be used to throw a custom exception.',
        insert: 'Exception(${1:Message})',
        exp: [
            'Exception(Message , What, Extra)',
            '  throw Exception("Fail", -1)',
        ],
    },
    EXP: {
        group: 'Math',
        keyRawName: 'Exp',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Exp',
        msg: ' Returns _e_ (which is approximately 2.71828182845905) raised to the _N_th power.',
        insert: 'Exp($1)',
        exp: ['MsgBox, % Exp(1.2) ; Returns 3.320117'],
    },
    FILEEXIST: {
        group: 'File',
        keyRawName: 'FileExist',
        link: 'https://www.autohotkey.com/docs/commands/FileExist.htm',
        msg: 'Checks for the existence of a file or folder and returns its attributes.',
        insert: 'FileExist("${1:C:\\My_File.txt}")',
        exp: [
            'if FileExist("D:\\")',
            '    MsgBox, % "The drive exists."',
        ],
    },
    FILEOPEN: {
        group: 'File',
        keyRawName: 'FileOpen',
        link: 'https://www.autohotkey.com/docs/commands/FileOpen.htm',
        msg: 'Opens a file to read specific content from it and/or to write new content into it.',
        insert: 'FileOpen($1:{Filename}, Flags , Encoding)',
        exp: [
            'file := FileOpen(FileName, "r")',
        ],
    },
    FLOOR: {
        group: 'Math',
        keyRawName: 'Floor',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Floor',
        msg: ' Returns _Number_ rounded down to the nearest integer (without any .00 suffix).',
        insert: 'Floor($1)',
        exp: [
            'MsgBox, % Floor(1.2)  ; Returns 1',
            'MsgBox, % Floor(-1.2) ; Returns -2',
        ],
    },
    FORMAT: {
        group: 'Str',
        keyRawName: 'Format',
        link: 'https://www.autohotkey.com/docs/commands/Format.htm',
        msg: 'Formats a variable number of input values according to a format string.',
        insert: 'Format(${1:FormatStr })',
        exp: [
            'String := Format(FormatStr , Values...)',
            '; use a variadic function call:',
            'arr := [13, 240]',
            'MsgBox % Format("{2:x}{1:02x}", arr*)',
        ],
    },
    FUNC: {
        group: 'Misc.',
        keyRawName: 'Func',
        link: 'https://www.autohotkey.com/docs/commands/Func.htm',
        msg: 'Retrieves a reference to the specified function.\n\n[Func Object](https://www.autohotkey.com/docs/objects/Func.htm)',
        insert: 'Func(${1:FunctionName})',
        exp: [
            '~F10:: fn_f10()',
            '',
            'fn_f10() {',
            '    ToolTip, % "hi~hi~hi~", A_ScreenWidth // 2',
            '    fn := Func("fn_clear_ToolTip")',
            '    SetTimer, %fn%, -3000',
            '}',
            'fn_clear_ToolTip() {',
            '    local',
            '    ToolTip, , A_ScreenWidth // 2',
            '    ; ToolTip, % Value, x, y, 5',
            '}',
        ],
    },
    GETKEYNAME: {
        group: 'Keyboard',
        keyRawName: 'GetKeyName',
        link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
        msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        insert: 'GetKeyName(${1:Key})',
        exp: [
            'key  := "LWin" ; Any key can be used here.',
            'name := GetKeyName(key)',
            'vk   := GetKeyVK(key)',
            'sc   := GetKeySC(key)',
            'OutputDebug % name ; LWin',
            'OutputDebug % vk ; 91',
            'OutputDebug % sc ; 347',
        ],
    },
    GETKEYSC: {
        group: 'Keyboard',
        keyRawName: 'GetKeySC',
        link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
        msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        insert: 'GetKeySC(${1:Key})',
        exp: [
            'key  := "LWin" ; Any key can be used here.',
            'name := GetKeyName(key)',
            'vk   := GetKeyVK(key)',
            'sc   := GetKeySC(key)',
            'OutputDebug % name ; LWin',
            'OutputDebug % vk ; 91',
            'OutputDebug % sc ; 347',
        ],
    },
    GETKEYSTATE: {
        group: 'Keyboard',
        keyRawName: 'GetKeyState',
        link: 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#function',
        msg: 'Returns true , link: "1", if the specified key is down and false , link: "0", if it is up.',
        insert: 'GetKeyState(${1:KeyName})',
        exp: [
            'KeyIsDown := GetKeyState(KeyName , Mode)',
            'state := GetKeyState("RButton")  ; Right mouse button.',
        ],
    },
    GETKEYVK: {
        group: 'Keyboard',
        keyRawName: 'GetKeyVK',
        link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
        msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        insert: 'GetKeyVK(${1:Key})',
        exp: [
            'key  := "LWin" ; Any key can be used here.',
            'name := GetKeyName(key)',
            'vk   := GetKeyVK(key)',
            'sc   := GetKeySC(key)',
            'OutputDebug % name ; LWin',
            'OutputDebug % vk ; 91',
            'OutputDebug % sc ; 347',
        ],
    },
    HOTSTRING: {
        group: 'Keyboard',
        keyRawName: 'Hotstring',
        link: 'https://www.autohotkey.com/docs/commands/Hotstring.htm',
        msg: 'Creates, modifies, enables, or disables a hotstring while the script is running.',
        insert: 'Hotstring(${1:String})',
        exp: [
            'try',
            '    Hotstring("::btw")',
            'catch',
            '    MsgBox % "The hotstring does not exist or it has no variant for the current IfWin criteria."',
        ],
    },
    IL_ADD: {
        group: 'ImageLists',
        keyRawName: 'IL_Add',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#IL_Add',
        msg: 'Adds an icon or picture to the specified _ImageListID_ and returns the new icon\'s index (1 is the first icon, 2 is the second, and so on).',
        insert: 'IL_Add(${1:ImageListID}, ${2:Filename})',
        exp: [
            '; https://www.autohotkey.com/docs/commands/ListView.htm#BuiltIn',
            'IL_Add(ImageListID, Filename , IconNumber, ResizeNonIcon)',
        ],
    },
    IL_CREATE: {
        group: 'ImageLists',
        keyRawName: 'IL_Create',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#IL_Create',
        msg: 'Creates a new ImageList, initially empty, and returns the unique ID of the ImageList (or 0 upon failure).',
        insert: 'IL_Create($1)',
        exp: [
            '; https://www.autohotkey.com/docs/commands/ListView.htm#BuiltIn',
            'IL_Create(InitialCount, GrowCount, LargeIcons)',
        ],
    },
    IL_DESTROY: {
        group: 'ImageLists',
        keyRawName: 'IL_Destroy',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#IL_Destroy',
        msg: 'Deletes the specified ImageList and returns 1 upon success and 0 upon failure.',
        insert: 'IL_Destroy(${1:ImageListID})',
        exp: [
            '; https://www.autohotkey.com/docs/commands/ListView.htm#BuiltIn',
            'IL_Destroy(ImageListID)',
        ],
    },
    INPUTHOOK: {
        group: 'Keyboard',
        keyRawName: 'InputHook',
        link: 'https://www.autohotkey.com/docs/commands/InputHook.htm',
        msg: 'Creates an object which can be used to collect or intercept keyboard input.',
        insert: 'InputHook($1)',
        exp: [
            'InputHook := InputHook(Options, EndKeys, MatchList)',
        ],
    },
    INSTR: {
        group: 'Str',
        keyRawName: 'InStr',
        link: 'https://www.autohotkey.com/docs/commands/InStr.htm',
        msg: 'Searches for a given occurrence of a string, from the left or the right.',
        insert: 'InStr(${1:Haystack}, ${2:Needle})',
        exp: [
            'FoundPos := InStr(Haystack, Needle , CaseSensitive := false, StartingPos := 1, Occurrence := 1)',
            ';',
            'MsgBox % InStr("123abc789", "abc") ; Returns 4',
        ],
    },
    ISBYREF: {
        group: 'Func',
        keyRawName: 'IsByRef',
        link: 'https://www.autohotkey.com/docs/commands/IsByRef.htm',
        msg: 'Returns a non-zero number if the specified [ByRef parameter](https://www.autohotkey.com/docs/Functions.htm#ByRef) was supplied with a variable.',
        insert: 'IsByRef(${1:ParameterVar})',
        exp: [
            '~F10:: fn_f10()',
            '',
            'fn_f10(){',
            '    a1 := 0',
            '    fnExp(a1, 5)',
            '}',
            '',
            'fnExp(ByRef Param, Param2){',
            '    MsgBox % IsByRef(Param) ; 1 -> true',
            '    MsgBox % IsByRef(Param2) ; 0 -> false',
            '}',
            '',
        ],
    },
    ISFUNC: {
        group: 'Func',
        keyRawName: 'IsFunc',
        link: 'https://www.autohotkey.com/docs/commands/IsFunc.htm',
        msg: 'Returns a non-zero number if the specified function exists in the script.',
        insert: 'IsFunc("${1:FunctionName}")',
        exp: [
            'count := IsFunc("RegExReplace") ; Any function name can be used here.',
            'if count',
            '    MsgBox, % "This function exists and has " count-1 " mandatory parameters."',
            'else ; count is 0',
            '    MsgBox, % "This function does not exist."',
        ],
    },
    ISLABEL: {
        group: 'Misc.',
        keyRawName: 'IsLabel',
        link: 'https://www.autohotkey.com/docs/commands/IsLabel.htm',
        msg: 'Returns a non-zero number if the specified label exists in the script.',
        insert: 'IsLabel("${1:LabelName}")',
        exp: [
            'TrueOrFalse := IsLabel(LabelName)',
            'if IsLabel("LabelA")',
            '    MsgBox % "Subroutine exists"',
            'else',
            '    MsgBox % "Subroutine doesn\'t exist"',
            '',
            'LabelA:',
            'return',
        ],
    },
    ISOBJECT: {
        group: 'Misc.',
        keyRawName: 'IsObject',
        link: 'https://www.autohotkey.com/docs/commands/IsObject.htm',
        msg: 'Returns a non-zero number if the specified value is an object.',
        insert: 'IsObject("${1:ObjectValue}")',
        exp: [
            'TrueOrFalse := IsObject(ObjectValue)',
            'object := {key: "value"}',
            '',
            'if IsObject(object)',
            '    MsgBox % "This is an object."',
            'else',
            '    MsgBox % "This is not an object."',
        ],
    },
    LN: {
        group: 'Math',
        keyRawName: 'Ln',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Ln',
        msg: ' Returns the natural logarithm (base e) of _Number_.',
        insert: 'Ln($1)',
        exp: ['MsgBox, % Ln(1.2) ; Returns 0.182322'],
    },
    LOADPICTURE: {
        group: 'GUI',
        keyRawName: 'LoadPicture',
        link: 'https://www.autohotkey.com/docs/commands/LoadPicture.htm',
        msg: 'Loads a picture from file and returns a bitmap or icon handle.',
        insert: 'LoadPicture(${1:Filename})',
        exp: [
            'Handle := LoadPicture(Filename , Options, ByRef ImageType)',
        ],
    },
    LOG: {
        group: 'Math',
        keyRawName: 'Log',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Log',
        msg: ' Returns the logarithm (base 10) of _Number_.',
        insert: 'Log($1)',
        exp: ['MsgBox, % Log(1.2) ; Returns 0.079181'],
    },
    LTRIM: {
        group: 'Str',
        keyRawName: 'LTrim',
        link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
        msg: 'Trims characters from the beginning and/or end of a string.',
        insert: 'LTrim(${1:String})',
        exp: [
            'Result :=  Trim(String, OmitChars := " `t")',
            'Result := LTrim(String, OmitChars := " `t")',
            'Result := RTrim(String, OmitChars := " `t")',
        ],
    },
    LV_ADD: {
        group: 'ListView',
        keyRawName: 'LV_Add',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_Add',
        msg: 'Adds a new row to the bottom of the list.',
        insert: 'LV_Add($1)',
        exp: [
            'LV_Add(Options, Field1, Field2, ...)',
        ],
    },
    LV_DELETE: {
        group: 'ListView',
        keyRawName: 'LV_Delete',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_Delete',
        msg: 'Deletes the specified row or all rows.',
        insert: 'LV_Delete($1)',
        exp: [
            'LV_Delete(RowNumber)',
        ],
    },
    LV_DELETECOL: {
        group: 'ListView',
        keyRawName: 'LV_DeleteCol',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_DeleteCol',
        msg: 'Deletes the specified column and all of the contents beneath it.',
        insert: 'LV_DeleteCol(${1:ColumnNumber})',
        exp: [
            'LV_DeleteCol(ColumnNumber)',
        ],
    },
    LV_GETCOUNT: {
        group: 'ListView',
        keyRawName: 'LV_GetCount',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_GetCount',
        msg: 'Returns the total number of rows or columns, or the number of selected rows only.',
        insert: 'LV_GetCount($1)',
        exp: [
            'LV_GetCount(Mode)',
            '; exp',
            'Loop % LV_GetCount() {',
            '   ;',
            '}',
        ],
    },
    LV_GETNEXT: {
        group: 'ListView',
        keyRawName: 'LV_GetNext',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_GetNext',
        msg: 'Returns the row number of the next selected, checked, or focused row.',
        insert: 'LV_GetNext($1)',
        exp: [
            'LV_GetNext(StartingRowNumber, RowType)',
        ],
    },
    LV_GETTEXT: {
        group: 'ListView',
        keyRawName: 'LV_GetText',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_GetText',
        msg: 'Retrieves the text at the specified _RowNumber_ and _ColumnNumber_ and stores it in _OutputVar_.',
        insert: 'LV_GetText(${1:OutputVar}, ${2:RowNumber})',
        exp: [
            'LV_GetText(OutputVar, RowNumber , ColumnNumber)',
        ],
    },
    LV_INSERT: {
        group: 'ListView',
        keyRawName: 'LV_Insert',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_Insert',
        msg: 'Inserts a new row at the specified row number.',
        insert: 'LV_Insert(${1:RowNumber})',
        exp: [
            'LV_Insert(RowNumber , Options, Col1, Col2, ...)',
        ],
    },
    LV_INSERTCOL: {
        group: 'ListView',
        keyRawName: 'LV_InsertCol',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_InsertCol',
        msg: 'Inserts a new column at the specified column number.',
        insert: 'LV_InsertCol(${1:ColumnNumber})',
        exp: [
            'LV_InsertCol(ColumnNumber , Options, ColumnTitle)',
        ],
    },
    LV_MODIFY: {
        group: 'ListView',
        keyRawName: 'LV_Modify',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_Modify',
        msg: 'Modifies the attributes and/or text of a row.',
        insert: 'LV_Modify(${1:RowNumber})',
        exp: [
            'LV_Modify(RowNumber , Options, NewCol1, NewCol2, ...)',
        ],
    },
    LV_MODIFYCOL: {
        group: 'ListView',
        keyRawName: 'LV_ModifyCol',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_ModifyCol',
        msg: 'Modifies the attributes and/or text of the specified column and its header.',
        insert: 'LV_ModifyCol($1)',
        exp: [
            'LV_ModifyCol(ColumnNumber, Options, ColumnTitle)',
        ],
    },
    LV_SETIMAGELIST: {
        group: 'ListView',
        keyRawName: 'LV_SetImageList',
        link: 'https://www.autohotkey.com/docs/commands/ListView.htm#LV_SetImageList',
        msg: 'Sets or replaces an [ImageList](https://www.autohotkey.com/docs/commands/ListView.htm#IL) for displaying icons.',
        insert: 'LV_SetImageList(${1:ImageListID})',
        exp: [
            'LV_SetImageList(ImageListID , IconType)',
        ],
    },
    MAX: {
        group: 'Math',
        keyRawName: 'Max',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Max',
        msg: ' Returns the highest/lowest value of one or more numbers.',
        insert: 'Max($1)',
        exp: [
            'Value := Max(Number1 , Number2, ...)',
            'MsgBox, % Max(2.11, -2, 0) ; Returns 2.11',
            'array := [1, 2, 3, 4]',
            'MsgBox, % Max(array*) ; Returns 4',
        ],
    },
    MENUGETHANDLE: {
        group: 'GUI',
        keyRawName: 'MenuGetHandle',
        link: 'https://www.autohotkey.com/docs/commands/MenuGetHandle.htm',
        msg: 'Retrieves the [Win32 menu](https://www.autohotkey.com/docs/commands/Menu.htm#Win32_Menus) handle of a menu.',
        insert: 'MenuGetHandle(${1:MenuName})',
        exp: ['Handle := MenuGetHandle(MenuName)'],
    },
    MENUGETNAME: {
        group: 'GUI',
        keyRawName: 'MenuGetName',
        link: 'https://www.autohotkey.com/docs/commands/MenuGetName.htm',
        msg: 'Retrieves the name of a menu given a handle to its underlying [Win32 menu](https://www.autohotkey.com/docs/commands/Menu.htm#Win32_Menus).',
        insert: 'MenuGetName(${1:Handle})',
        exp: ['MenuName := MenuGetName(Handle)'],
    },
    MIN: {
        group: 'Math',
        keyRawName: 'Min',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Min',
        msg: ' Returns the highest/lowest value of one or more numbers.',
        insert: 'Min($1)',
        exp: [
            'Value := Min(Number1 , Number2, ...)',
            'MsgBox, % Min(2.11, -2, 0) ; Returns -2',
            'array := [1, 2, 3, 4]',
            'MsgBox, % Max(array*) ; Returns 1',
        ],
    },
    MOD: {
        group: 'Math',
        keyRawName: 'Mod',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Mod',
        msg: ' Returns the remainder when _Dividend_ is divided by _Divisor_.',
        insert: 'Mod(${1:Dividend}, ${2:Divisor})',
        exp: [
            'Value := Mod(Dividend, Divisor)',
            'MsgBox, % Mod(7.5, 2) ; Returns 1.5 (2 x 3 + 1.5)',
        ],
    },
    NUMGET: {
        group: 'Lib',
        keyRawName: 'NumGet',
        link: 'https://www.autohotkey.com/docs/commands/NumGet.htm',
        msg: 'Returns the binary number stored at the specified address+offset.',
        insert: 'NumGet(${1:VarOrAddress})',
        exp: [
            'Width := NumGet(rc, 8, "int")',
        ],
    },
    NUMPUT: {
        group: 'Lib',
        keyRawName: 'NumPut',
        link: 'https://www.autohotkey.com/docs/commands/NumPut.htm',
        msg: 'Stores a number in binary format at the specified address+offset.',
        insert: 'NumPut(${1:Number}, ${2:VarOrAddress})',
        exp: [
            'NumPut(x, RectF, 0, "float"), NumPut(y, RectF, 4, "float")',
        ],
    },
    OBJADDREF: {
        group: 'Object',
        keyRawName: 'ObjAddRef',
        link: 'https://www.autohotkey.com/docs/commands/ObjAddRef.htm',
        msg: 'Increments or decrements an object\'s [reference count](https://www.autohotkey.com/docs/Objects.htm#Reference_Counting).',
        insert: 'ObjAddRef(${1:Ptr})',
        exp: ['ObjAddRef(Ptr)'],
    },
    OBJBINDMETHOD: {
        group: 'Object',
        keyRawName: 'ObjBindMethod',
        link: 'https://www.autohotkey.com/docs/commands/ObjBindMethod.htm',
        msg: 'Creates a [BoundFunc object](https://www.autohotkey.com/docs/objects/Functor.htm#BoundFunc) which calls a method of a given object.',
        insert: 'ObjBindMethod(${1:Obj}, ${2:Method})',
        exp: ['BoundFunc := ObjBindMethod(Obj, Method, Params)'],
    },
    OBJGETBASE: {
        group: 'Object',
        keyRawName: 'ObjGetBase',
        link: 'https://www.autohotkey.com/docs/objects/Object.htm#GetBase',
        msg: 'Retrieves an object\'s [base object](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects).',
        insert: 'ObjGetBase(${1:Obj})',
        exp: ['BaseObject := ObjGetBase(Object)'],
    },
    OBJRAWGET: {
        group: 'Object',
        keyRawName: 'ObjRawGet',
        link: 'https://www.autohotkey.com/docs/objects/Object.htm#RawGet',
        msg: 'Retrieves a key-value pair from an object, bypassing the object\'s [meta-functions](https://www.autohotkey.com/docs/Objects.htm#Meta_Functions).',
        insert: 'ObjRawGet(${1:Obj})',
        exp: ['Value := ObjRawGet(Object, Key)'],
    },
    OBJRAWSET: {
        group: 'Object',
        keyRawName: 'ObjRawSet',
        link: 'https://www.autohotkey.com/docs/objects/Object.htm#RawSet',
        msg: 'Stores or overwrites a key-value pair in an object, bypassing the object\'s [meta-functions](https://www.autohotkey.com/docs/Objects.htm#Meta_Functions).',
        insert: 'ObjRawSet(${1:Obj}, ${2:key}, ${3:value})',
        exp: [
            'ObjRawSet(Object, Key, Value) ; -> without __Set',
            'Object[Key] := Value ; -> use __Set',
        ],
    },
    OBJRELEASE: {
        group: 'Object',
        keyRawName: 'ObjRelease',
        link: 'https://www.autohotkey.com/docs/commands/ObjAddRef.htm',
        msg: 'Increments or decrements an object\'s [reference count](https://www.autohotkey.com/docs/Objects.htm#Reference_Counting).',
        insert: 'ObjRelease(${1:Ptr})',
        exp: ['ObjRelease(Ptr)'],
    },
    OBJSETBASE: {
        group: 'Object',
        keyRawName: 'ObjSetBase',
        link: 'https://www.autohotkey.com/docs/objects/Object.htm#SetBase',
        msg: 'Sets an object\'s [base object](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects).',
        insert: 'ObjSetBase(${1:Object}, ${2:BaseObject})',
        exp: ['ObjSetBase(Object, BaseObject)'],
    },
    ONCLIPBOARDCHANGE: {
        group: 'Env',
        keyRawName: 'OnClipboardChange',
        link: 'https://www.autohotkey.com/docs/commands/OnClipboardChange.htm#function',
        msg: 'Registers a [function](https://www.autohotkey.com/docs/Functions.htm) or [function object](https://www.autohotkey.com/docs/objects/Functor.htm) to run whenever the clipboard\'s content changes.',
        insert: 'OnClipboardChange(${1:element})',
        exp: [
            '#Persistent',
            'OnClipboardChange("ClipChanged")',
            'return',
            '',
            'ClipChanged(Type) {',
            '   ToolTip Clipboard data type: %Type%',
            '   Sleep 1000',
            '   ToolTip  ; Turn off the tip.',
            '}',
        ], // <-------
    },
    ONERROR: {
        group: 'Control',
        keyRawName: 'OnError',
        link: 'https://www.autohotkey.com/docs/commands/OnError.htm',
        msg: 'Specifies a function to run automatically when an unhandled error occurs.',
        insert: 'OnError(${1:Func})',
        exp: [
            'OnError(Func , AddRemove)',
            ';',
            'OnError("LogError")',
            '%cause% := error',
            '',
            'LogError(exception) {',
            '    FileAppend % "Error on line " exception.Line ": " exception.Message "`n", errorlog.txt',
            '}',
        ],
    },
    ONEXIT: {
        group: 'Control',
        keyRawName: 'OnExit',
        link: 'https://www.autohotkey.com/docs/commands/OnExit.htm#function',
        msg: 'Specifies a function to run automatically when the script exits.',
        insert: 'OnExit(${1:Func})',
        exp: [
            'OnExit(Func , AddRemove)',
            '; Func -> ExitFunc(ExitReason, ExitCode)',
            '',
            '#Persistent  ; Prevent the script from exiting automatically.',
            'OnExit("ExitFunc")',
            '',
            'ExitFunc(ExitReason, ExitCode) {',
            '    if ExitReason not in Logoff,Shutdown',
            '    {',
            '        MsgBox, 4, , Are you sure you want to exit?',
            '        IfMsgBox, No',
            '            return 1  ; OnExit functions must return non-zero to prevent exit.',
            '    }',
            '    ; Do not call ExitApp -- that would prevent other OnExit functions from being called.',
            '}',
        ],
    },
    ONMESSAGE: {
        group: 'GUI',
        keyRawName: 'OnMessage',
        link: 'https://www.autohotkey.com/docs/commands/OnMessage.htm',
        msg: 'Monitors a message/event.',
        insert: 'OnMessage(${1:MsgNumber})',
        exp: [
            'OnMessage(MsgNumber , Function, MaxThreads := 1)',
            ';exp',
            'FuncObj := func("HelloWorld")',
            'OnMessage(0x0401, FuncObj)',
            ';',
            'HelloWorld() { ; def a function',
            '    MsgBox % "Hello, world!"',
            '}',
        ],
    },
    ORD: {
        group: 'Str',
        keyRawName: 'Ord',
        link: 'https://www.autohotkey.com/docs/commands/Ord.htm',
        msg: 'Returns the ordinal value (numeric character code) of the first character in the specified string.\n\nApart from the Unicode supplementary character detection, this function is identical to [Asc()](https://www.autohotkey.com/docs/commands/Asc.htm).',
        insert: 'Ord(${1:String})',
        exp: [
            ';Both message boxes below show 116, because only the first character is considered.',
            'MsgBox, % Ord("t") ',
            'MsgBox, % Ord("test")',
        ],
    },
    REGEXMATCH: {
        group: 'Str',
        keyRawName: 'RegExMatch',
        link: 'https://www.autohotkey.com/docs/commands/RegExMatch.htm',
        msg: [
            'Determines whether a string contains a pattern , link: "regular expression",.',
            '',
            '### OutputVar',
            '**Mode 1 (default):** Specify a variable in which to store the part of _Haystack_ that matched the entire pattern. If the pattern is not found (that is, if the function returns 0), this variable and all array elements below are made blank.',
            '',
            'If any [capturing subpatterns](https://www.autohotkey.com/docs/misc/RegEx-QuickRef.htm#subpat) are present inside _NeedleRegEx_, their matches are stored in a [pseudo-array](https://www.autohotkey.com/docs/misc/Arrays.htm#pseudo) whose base name is _OutputVar_. For example, if the variable\'s name is _Match_, the substring that matches the first subpattern would be stored in _Match1_, the second would be stored in _Match2_, and so on. The exception to this is [named subpatterns](https://www.autohotkey.com/docs/commands/RegExMatch.htm#NamedSubPat): they are stored by name instead of number. For example, the substring that matches the named subpattern (?P<Year>\\d{4}) would be stored in _MatchYear_. If a particular subpattern does not match anything (or if the function returns zero), the corresponding variable is made blank.',
            '',
            'Within a [function](https://www.autohotkey.com/docs/Functions.htm), to create a pseudo-array that is global instead of local, [declare](https://www.autohotkey.com/docs/Functions.htm#Global) the base name of the pseudo-array (e.g. Match) as a global variable prior to using it. The converse is true for [assume-global](https://www.autohotkey.com/docs/Functions.htm#AssumeGlobal) functions. However, it is often also necessary to declare each element, due to a [common source of confusion](https://www.autohotkey.com/docs/Functions.htm#ArrayConfusion).',
            '',
            '**Mode 2 (position-and-length):** If a capital P is present in the RegEx\'s options -- such as P)abc.\\*123 -- the _length_ of the entire-pattern match is stored in _OutputVar_ (or 0 if no match). If any [capturing subpatterns](https://www.autohotkey.com/docs/misc/RegEx-QuickRef.htm#subpat) are present, their positions and lengths are stored in two [pseudo-arrays](https://www.autohotkey.com/docs/misc/Arrays.htm#pseudo): _OutputVarPos_ and _OutputVarLen_. For example, if the variable\'s base name is _Match_, the one-based _position_ of the first subpattern\'s match would be stored in _MatchPos1_, and its length in _MatchLen1_ (zero is stored in both if the subpattern was not matched or the function returns 0). The exception to this is [named subpatterns](https://www.autohotkey.com/docs/commands/RegExMatch.htm#NamedSubPat): they are stored by name instead of number (e.g. _MatchPosYear_ and _MatchLenYear_).',
            '',
            '**Mode 3 (match object)** [\\[v1.1.05+\\]](https://www.autohotkey.com/docs/AHKL_ChangeLog.htm#v1.1.05.00 "Applies to AutoHotkey v1.1.05 and later")**:** If a capital O is present in the RegEx\'s options -- such as O)abc.\\*123 -- a [match object](https://www.autohotkey.com/docs/commands/RegExMatch.htm#MatchObject) is stored in _OutputVar_. This object can be used to retrieve the position, length and value of the overall match and of each [captured subpattern](https://www.autohotkey.com/docs/misc/RegEx-QuickRef.htm#subpat), if present.',
        ].join('\n'),
        insert: 'RegExMatch(${1:Haystack}, ${2:NeedleRegEx})',
        exp: [
            'FoundPos := RegExMatch(Haystack, NeedleRegEx , OutputVar, StartingPos := 1)',
            'MsgBox % RegExMatch("abc123123", "123$")',
        ],
    },
    REGEXREPLACE: {
        group: 'Str',
        keyRawName: 'RegExReplace',
        link: 'https://www.autohotkey.com/docs/commands/RegExReplace.htm',
        msg: 'Replaces occurrences of a pattern , link: "regular expression", inside a string.',
        insert: 'RegExReplace(${1:Haystack}, ${2:NeedleRegEx})',
        exp: [
            'NewStr := RegExReplace(Haystack, NeedleRegEx , Replacement := "", OutputVarCount := "", Limit := -1, StartingPos := 1)',
            'MsgBox % RegExReplace("abc123123", "123$", "xyz")',
        ],
    },
    REGISTERCALLBACK: {
        group: 'Lib',
        keyRawName: 'RegisterCallback',
        link: 'https://www.autohotkey.com/docs/commands/RegisterCallback.htm',
        msg: 'Creates a machine-code address that when called, redirects the call to a [function](https://www.autohotkey.com/docs/Functions.htm) in the script.',
        insert: 'RegisterCallback("${1:FunctionName}")',
        exp: [
            'callback := RegisterCallback("TheFunc", "F", 3)  ; Parameter list size must be specified.',
            'TheFunc("TheFunc was called directly.")          ; Call TheFunc directly.',
            'DllCall(callback, "float", 10.5, "int64", 42)        ; Call TheFunc via callback.',
            'TheFunc(params*) {',
            '    if IsObject(params)',
            '        MsgBox % params[1]',
            '    else',
            '        MsgBox % NumGet(params+0, "float") ", " NumGet(params+A_PtrSize, "int64")',
            '}',
        ],
    },
    ROUND: {
        group: 'Math',
        keyRawName: 'Round',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Round',
        msg: ' Returns _Number_ rounded to _N_ decimal places.',
        insert: 'Round(${1:Number}, ${2:N})',
        exp: [
            'Value := Round(Number , N)',
            'MsgBox, % Round(3.14)    ; Returns 3',
            'MsgBox, % Round(3.14, 1) ; Returns 3.1',
            'MsgBox, % Round(345, -1) ; Returns 350',
            'MsgBox, % Round(345, -2) ; Returns 300',
        ],
    },
    RTRIM: {
        group: 'Str',
        keyRawName: 'RTrim',
        link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
        msg: 'Trims characters from the beginning and/or end of a string.',
        insert: 'RTrim(${1:String})',
        exp: [
            'Result :=  Trim(String, OmitChars := " `t")',
            'Result := LTrim(String, OmitChars := " `t")',
            'Result := RTrim(String, OmitChars := " `t")',
        ],
    },
    SB_SETICON: {
        group: 'StatusBar',
        keyRawName: 'SB_SetIcon',
        link: 'https://www.autohotkey.com/docs/commands/GuiControls.htm#SB_SetIcon',
        msg: 'Displays a small icon to the left of the text in the specified part.',
        insert: 'SB_SetIcon(${1:Filename})',
        exp: [
            'SB_SetIcon(Filename , IconNumber, PartNumber)',
        ],
    },
    SB_SETTEXT: {
        group: 'StatusBar',
        keyRawName: 'SB_SetText',
        link: 'https://www.autohotkey.com/docs/commands/GuiControls.htm#SB_SetText',
        msg: 'Displays _NewText_ in the specified part of the status bar.',
        insert: 'SB_SetText(${1:NewText})',
        exp: [
            'SB_SetText(NewText , PartNumber, Style)',
        ],
    },
    SB_SETPARTS: {
        group: 'StatusBar',
        keyRawName: 'SB_SetParts',
        link: 'https://www.autohotkey.com/docs/commands/GuiControls.htm#SB_SetParts',
        msg: 'Divides the bar into multiple sections according to the specified widths (in pixels).',
        insert: 'SB_SetParts($1)',
        exp: [
            'SB_SetParts(Width1, Width2, ... Width255)',
        ],
    },
    SIN: {
        group: '△Math',
        keyRawName: 'Sin',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Sin',
        msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        insert: 'Sin(${1:Number})',
        exp: [
            'Value := Sin(Number)',
            '',
            'MsgBox, % Sin(1.2) ; Returns 0.932039',
            'MsgBox, % Sin(1) ; Returns 0.841471',
            'MsgBox, % Sin(90) ; Returns 0.893997',
            'pi := 4 * ATan(1)',
            'MsgBox, % Sin(90*pi) ; Returns -0.0',
        ],
    },
    SQRT: {
        group: 'Math',
        keyRawName: 'Sqrt',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Sqrt',
        msg: ' Returns the square root of _Number_.',
        insert: 'Sqrt(${1:Number})',
        exp: [
            'Value := Sqrt(Number)',
            'MsgBox, % Sqrt(16) ; Returns 4',
        ],
    },
    STRGET: {
        group: 'Lib',
        keyRawName: 'StrGet',
        link: 'https://www.autohotkey.com/docs/commands/StrGet.htm',
        msg: 'Copies a string from a memory address, optionally converting it from a given code page.',
        insert: 'StrGet(${1:Source})',
        exp: [
            'str := StrGet(address, "cp0")  ; Code page 0, unspecified length',
            'str := StrGet(address, n, 0)   ; Maximum n chars, code page 0',
            'str := StrGet(address, 0)      ; Maximum 0 chars (always blank)',
        ],
    },
    STRLEN: {
        group: 'Str',
        keyRawName: 'StrLen',
        link: 'https://www.autohotkey.com/docs/commands/StrLen.htm',
        msg: 'Retrieves the count of how many characters are in a string.',
        insert: 'StrLen(${1:String})',
        exp: [
            'MsgBox % StrLen("0123456789") ; 10',
        ],
    },
    STRPUT: {
        group: 'Lib',
        keyRawName: 'StrPut',
        link: 'https://www.autohotkey.com/docs/commands/StrPut.htm',
        msg: 'Copies a string to a memory address, optionally converting it between code pages.',
        insert: 'StrPut(${1:String})',
        exp: [
            'StrPut(str, address, "cp0") ; Code page 0, unspecified buffer size',
            'StrPut(str, address, n, 0)  ; Maximum n chars, code page 0',
            'StrPut(str, address, 0)     ; Unsupported (maximum 0 chars)',
        ],
    },
    STRREPLACE: {
        group: 'Str',
        keyRawName: 'StrReplace',
        link: 'https://www.autohotkey.com/docs/commands/StrReplace.htm',
        msg: 'Replaces occurrences of the specified substring with a new string.',
        insert: 'StrReplace(${1:Haystack}, ${2:Needle})',
        exp: [
            'ReplacedStr := StrReplace(Haystack, Needle , ReplaceText, OutputVarCount, Limit)',
            'MsgBox % StrReplace("aor,ayz, y=a*3", "a", "x")',
        ],
    },
    STRSPLIT: {
        group: 'Str',
        keyRawName: 'StrSplit',
        link: 'https://www.autohotkey.com/docs/commands/StrSplit.htm',
        msg: 'Separates a string into an array of substrings using the specified delimiters.',
        insert: 'StrSplit(${1:String})',
        exp: [
            'Array := StrSplit(String , Delimiters, OmitChars, MaxParts)',
            'StrSplit("a,b,c", ",")',
        ],
    },
    SUBSTR: {
        group: 'Str',
        keyRawName: 'SubStr',
        link: 'https://www.autohotkey.com/docs/commands/SubStr.htm',
        msg: 'Retrieves one or more characters from the specified position in a string.',
        insert: 'SubStr(${1:String}, ${2:StartingPos})',
        exp: [
            'NewStr := SubStr(String, StartingPos , Length)',
            'MsgBox % SubStr("123abc789", 4, 3) ; Returns abc',
        ],
    },
    TAN: {
        group: '△Math',
        keyRawName: 'Tan',
        link: 'https://www.autohotkey.com/docs/commands/Math.htm#Tan',
        msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        insert: 'Tan(${1:Number})',
        exp: [
            'Value := Tan(Number)',
            '',
            'MsgBox, % Tan(45) ; Returns 1.619775',
            'pi := 4 * ATan(1)',
            'MsgBox, % Tan(45*pi) ; Returns -0.0',
        ],
    },
    TRIM: {
        group: 'Str',
        keyRawName: 'Trim',
        link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
        msg: 'Trims characters from the beginning and/or end of a string.',
        insert: 'Trim(${1:String})',
        exp: [
            'Result :=  Trim(String, OmitChars := " `t")',
            'Result := LTrim(String, OmitChars := " `t")',
            'Result := RTrim(String, OmitChars := " `t")',
        ],
    },
    TV_ADD: {
        group: 'TreeView',
        keyRawName: 'TV_Add',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_Add',
        msg: 'Adds a new item to the TreeView and returns its unique Item ID number (or 0 upon failure).',
        insert: 'TV_Add(${1:Name})',
        exp: [
            'TV_Add(Name, ParentItemID, Options)',
        ],
    },
    TV_DELETE: {
        group: 'TreeView',
        keyRawName: 'TV_Delete',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_Delete',
        msg: 'Deletes the specified item or all items.',
        insert: 'TV_Delete($0)',
        exp: [
            'TV_Delete(ItemID)',
        ],
    },
    TV_GET: {
        group: 'TreeView',
        keyRawName: 'TV_Get',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_Get',
        msg: 'Returns the ID number of the specified item if it has the specified attribute.',
        insert: 'TV_Get(${1:ItemID}, ${2:Attribute})',
        exp: [
            'TV_Get(ItemID, Attribute)',
        ],
    },
    TV_GETCHILD: {
        group: 'TreeView',
        keyRawName: 'TV_GetChild',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetChild',
        msg: 'Returns the ID number of the specified item\'s first/top child (or 0 if none).',
        insert: 'TV_GetChild(${1:ParentItemID})',
        exp: [
            'TV_GetChild(ParentItemID)',
        ],
    },
    TV_GETCOUNT: {
        group: 'TreeView',
        keyRawName: 'TV_GetCount',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetCount',
        msg: 'Returns the total number of items in the control.',
        insert: 'TV_GetCount($0)',
        exp: [
            'TV_GetCount()',
        ],
    },
    TV_GETNEXT: {
        group: 'TreeView',
        keyRawName: 'TV_GetNext',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetNext',
        msg: 'Returns the ID number of the next item below the specified item (or 0 if none).',
        insert: 'TV_GetNext($0)',
        exp: [
            'TV_GetNext(ItemID, ItemType)',
        ],
    },
    TV_GETPARENT: {
        group: 'TreeView',
        keyRawName: 'TV_GetParent',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetParent',
        msg: 'Returns the specified item\'s parent as an item ID.',
        insert: 'TV_GetParent(${1:ItemID})',
        exp: [
            'TV_GetParent(ItemID)',
        ],
    },
    TV_GETPREV: {
        group: 'TreeView',
        keyRawName: 'TV_GetPrev',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetPrev',
        msg: 'Returns the ID number of the sibling above the specified item (or 0 if none).',
        insert: 'TV_GetPrev(${1:ItemID})',
        exp: [
            'TV_GetPrev(ItemID)',
        ],
    },
    TV_GETSELECTION: {
        group: 'TreeView',
        keyRawName: 'TV_GetSelection',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetSelection',
        msg: 'Returns the selected item\'s ID number.',
        insert: 'TV_GetSelection($0)',
        exp: [
            'TV_GetSelection()',
        ],
    },
    TV_GETTEXT: {
        group: 'TreeView',
        keyRawName: 'TV_GetText',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_GetText',
        msg: 'Retrieves the text/name of the specified _ItemID_ and stores it in _OutputVar_.',
        insert: 'TV_GetText(${1:OutputVar}, ${2:ItemID})',
        exp: [
            'TV_GetText(OutputVar, ItemID)',
        ],
    },
    TV_MODIFY: {
        group: 'TreeView',
        keyRawName: 'TV_Modify',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_Modify',
        msg: 'Modifies the attributes and/or name of an item.',
        insert: 'TV_Modify(${1:ItemID})',
        exp: [
            'TV_Modify(ItemID , Options, NewName)',
        ],
    },
    TV_SETIMAGELIST: {
        group: 'TreeView',
        keyRawName: 'TV_SetImageList',
        link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#TV_SetImageList',
        msg: 'Sets or replaces an [ImageList](https://www.autohotkey.com/docs/commands/TreeView.htm#ImageList) for displaying icons.',
        insert: 'TV_SetImageList(${1:ImageListID})',
        exp: [
            'TV_SetImageList(ImageListID , IconType)',
        ],
    },
    VARSETCAPACITY: {
        group: 'Lib',
        keyRawName: 'VarSetCapacity',
        link: 'https://www.autohotkey.com/docs/commands/VarSetCapacity.htm',
        msg: 'Enlarges a variable\'s holding capacity or frees its memory.',
        insert: 'VarSetCapacity(${1:TargetVar})',
        exp: [
            'VarSetCapacity(MyVar, 10240000)  ; ~10 MB',
        ],
    },
    WINACTIVE: {
        group: 'Window',
        keyRawName: 'WinActive',
        link: 'https://www.autohotkey.com/docs/commands/WinActive.htm',
        msg: 'Checks if the specified window is active and returns its unique ID , link: "HWND",.',
        insert: 'WinActive($1)',
        exp: [
            'UniqueID := WinActive(WinTitle, WinText, ExcludeTitle, ExcludeText)',
        ],
    },
    WINEXIST: {
        group: 'Window',
        keyRawName: 'WinExist',
        link: 'https://www.autohotkey.com/docs/commands/WinExist.htm',
        msg: 'Checks if the specified window exists and returns the unique ID , link: "HWND", of the first matching window.',
        insert: 'WinExist($1)',
        exp: [
            'UniqueID := WinExist(WinTitle, WinText, ExcludeTitle, ExcludeText)',
            '',
            'SetTitleMatchMode, 1',
            'SetTitleMatchMode, Fast',
            '',
            '~F10:: fn_f10()',
            '',
            'fn_f10() {',
            '    title := "Google"',
            '    Hwnd := WinExist(title " ahk_exe firefox.exe")',
            '    if (Hwnd == 0x0) {',
            '        MsgBox, % "not find fireFox"',
            '    } else {',
            '        MsgBox, % "find fireFox"',
            '    }',
            '    MsgBox, % Hwnd',
            '}',
            '',
        ],
    },
};
