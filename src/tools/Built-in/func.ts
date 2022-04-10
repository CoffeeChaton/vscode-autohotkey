/* eslint-disable no-template-curly-in-string */
/* eslint-disable max-lines */
/* eslint-disable max-len */
/* cSpell:disable */
/* spell-checker: disable */
import * as vscode from 'vscode';

// https://www.autohotkey.com/docs/Functions.htm#BuiltIn

export type TBuiltInFuncElement = {
    readonly keyRawName: string;
    readonly group: string;
    readonly link: string;
    readonly msg: string;
    readonly insert?: string; // TODO <--------
    readonly exp?: string[]; // <-------
};

export const BuiltInFunctionMap: ReadonlyMap<string, TBuiltInFuncElement> = Object.freeze(
    new Map([
        // ------------------------------------------------------------------------------------------------------------------
        // https://www.autohotkey.com/docs/Functions.htm#Frequently-used_Functions
        //  group: 'Frequently-used',
        // ------------------------------------------------------------------------------------------------------------------
        ['FILEEXIST', {
            keyRawName: 'FileExist',
            insert: 'FileExist("${1:C:\\My File.txt}")',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/FileExist.htm',
            msg: 'Checks for the existence of a file or folder and returns its attributes.',
            exp: [
                'if FileExist("D:\\")',
                '    MsgBox, % "The drive exists."',
            ],
        }],
        // TODO insert && EXP >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        ['GETKEYSTATE', {
            keyRawName: 'GetKeyState',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#function',
            msg: 'Returns true , link: "1", if the specified key is down and false , link: "0", if it is up.',
        }],
        ['INSTR', {
            keyRawName: 'InStr',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/InStr.htm',
            msg: 'Searches for a given occurrence of a string, from the left or the right.',
        }],
        ['REGEXMATCH', {
            keyRawName: 'RegExMatch',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/RegExMatch.htm',
            msg: 'Determines whether a string contains a pattern , link: "regular expression",.',
        }],
        ['REGEXREPLACE', {
            keyRawName: 'RegExReplace',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/RegExReplace.htm',
            msg: 'Replaces occurrences of a pattern , link: "regular expression", inside a string.',
        }],
        ['STRLEN', {
            keyRawName: 'StrLen',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/StrLen.htm',
            msg: 'Retrieves the count of how many characters are in a string.',
        }],
        ['STRREPLACE', {
            keyRawName: 'StrReplace',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/StrReplace.htm',
            msg: 'Replaces occurrences of the specified substring with a new string.',
        }],
        ['STRSPLIT', {
            keyRawName: 'StrSplit',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/StrSplit.htm',
            msg: 'Separates a string into an array of substrings using the specified delimiters.',
        }],
        ['SUBSTR', {
            keyRawName: 'SubStr',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/SubStr.htm',
            msg: 'Retrieves one or more characters from the specified position in a string.',
        }],
        ['WINACTIVE', {
            keyRawName: 'WinActive',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/WinActive.htm',
            msg: 'Checks if the specified window is active and returns its unique ID , link: "HWND",.',
        }],
        ['WINEXIST', {
            keyRawName: 'WinExist',
            group: 'Frequently-used',
            link: 'https://www.autohotkey.com/docs/commands/WinExist.htm',
            msg: 'Checks if the specified window exists and returns the unique ID , link: "HWND", of the first matching window.',
        }],
        // ------------------------------------------------------------------------------------------------------------------
        // https://www.autohotkey.com/docs/Functions.htm#Miscellaneous_Functions
        //  group: 'Miscellaneous Functions'
        // ------------------------------------------------------------------------------------------------------------------
        ['ASC', {
            group: 'Miscellaneous',
            keyRawName: 'Asc',
            link: 'https://www.autohotkey.com/docs/commands/Asc.htm',
            msg: 'Returns the numeric value of the first byte or UTF-16 code unit in the specified string.',
        }],
        ['CHR', {
            group: 'Miscellaneous',
            keyRawName: 'Chr',
            link: 'https://www.autohotkey.com/docs/commands/Chr.htm',
            msg: 'Returns the string (usually a single character) corresponding to the character code indicated by the specified number.',
        }],
        ['DLLCALL', {
            group: 'Miscellaneous',
            keyRawName: 'DllCall',
            link: 'https://www.autohotkey.com/docs/commands/DllCall.htm',
            msg: 'Calls a function inside a DLL, such as a standard Windows API function.',
        }],
        ['EXCEPTION', {
            group: 'Miscellaneous',
            keyRawName: 'Exception',
            link: 'https://www.autohotkey.com/docs/commands/Throw.htm#Exception',
            msg: 'Creates an object which can be used to throw a custom exception.',
        }],
        ['FILEOPEN', {
            group: 'Miscellaneous',
            keyRawName: 'FileOpen',
            link: 'https://www.autohotkey.com/docs/commands/FileOpen.htm',
            msg: 'Opens a file to read specific content from it and/or to write new content into it.',
        }],
        ['FORMAT', {
            group: 'Miscellaneous',
            keyRawName: 'Format',
            link: 'https://www.autohotkey.com/docs/commands/Format.htm',
            msg: 'Formats a variable number of input values according to a format string.',
        }],
        ['FUNC', {
            group: 'Miscellaneous',
            keyRawName: 'Func',
            link: 'https://www.autohotkey.com/docs/commands/Func.htm',
            msg: 'Retrieves a reference to the specified function.',
        }],
        ['GETKEYNAME', {
            group: 'Miscellaneous',
            keyRawName: 'GetKeyName',
            link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
            msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        }],
        ['GETKEYVK', {
            group: 'Miscellaneous',
            keyRawName: 'GetKeyVK',
            link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
            msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        }],
        ['GETKEYSC', {
            group: 'Miscellaneous',
            keyRawName: 'GetKeySC',
            link: 'https://www.autohotkey.com/docs/commands/GetKey.htm',
            msg: 'Retrieves the name/text, virtual key code or scan code of a key.',
        }],
        ['HOTSTRING', {
            group: 'Miscellaneous',
            keyRawName: 'Hotstring',
            link: 'https://www.autohotkey.com/docs/commands/Hotstring.htm',
            msg: 'Creates, modifies, enables, or disables a hotstring while the script is running.',
        }],
        ['IL_XXX', {
            group: 'Miscellaneous',
            keyRawName: 'IL_XXX',
            link: 'https://www.autohotkey.com/docs/commands/ListView.htm#IL',
            msg: 'Functions to add icons/pictures to, create or delete ImageLists used by ListView or TreeView controls.',
        }],
        ['INPUTHOOK', {
            group: 'Miscellaneous',
            keyRawName: 'InputHook',
            link: 'https://www.autohotkey.com/docs/commands/InputHook.htm',
            msg: 'Creates an object which can be used to collect or intercept keyboard input.',
        }],
        ['ISBYREF', {
            group: 'Miscellaneous',
            keyRawName: 'IsByRef',
            link: 'https://www.autohotkey.com/docs/commands/IsByRef.htm',
            msg: 'Returns a non-zero number if the specified [ByRef parameter](https://www.autohotkey.com/docs/Functions.htm#ByRef) was supplied with a variable.',
        }],
        ['ISFUNC', {
            group: 'Miscellaneous',
            keyRawName: 'IsFunc',
            link: 'https://www.autohotkey.com/docs/commands/IsFunc.htm',
            msg: 'Returns a non-zero number if the specified function exists in the script.',
        }],
        ['ISLABEL', {
            group: 'Miscellaneous',
            keyRawName: 'IsLabel',
            link: 'https://www.autohotkey.com/docs/commands/IsLabel.htm',
            msg: 'Returns a non-zero number if the specified label exists in the script.',
        }],
        ['ISOBJECT', {
            group: 'Miscellaneous',
            keyRawName: 'IsObject',
            link: 'https://www.autohotkey.com/docs/commands/IsObject.htm',
            msg: 'Returns a non-zero number if the specified value is an object.',
        }],
        ['LOADPICTURE', {
            group: 'Miscellaneous',
            keyRawName: 'LoadPicture',
            link: 'https://www.autohotkey.com/docs/commands/LoadPicture.htm',
            msg: 'Loads a picture from file and returns a bitmap or icon handle.',
        }],
        ['LV_XXX', {
            group: 'Miscellaneous',
            keyRawName: 'LV_XXX',
            link: 'https://www.autohotkey.com/docs/commands/ListView.htm#BuiltIn',
            msg: 'Functions to add, insert, modify or delete ListView rows/colums, or to get data from them.',
        }],
        ['MENUGETHANDLE', {
            group: 'Miscellaneous',
            keyRawName: 'MenuGetHandle',
            link: 'https://www.autohotkey.com/docs/commands/MenuGetHandle.htm',
            msg: 'Retrieves the [Win32 menu](https://www.autohotkey.com/docs/commands/Menu.htm#Win32_Menus) handle of a menu.',
        }],
        ['MENUGETNAME', {
            group: 'Miscellaneous',
            keyRawName: 'MenuGetName',
            link: 'https://www.autohotkey.com/docs/commands/MenuGetName.htm',
            msg: 'Retrieves the name of a menu given a handle to its underlying [Win32 menu](https://www.autohotkey.com/docs/commands/Menu.htm#Win32_Menus).',
        }],
        ['NUMGET', {
            group: 'Miscellaneous',
            keyRawName: 'NumGet',
            link: 'https://www.autohotkey.com/docs/commands/NumGet.htm',
            msg: 'Returns the binary number stored at the specified address+offset.',
        }],
        ['NUMPUT', {
            group: 'Miscellaneous',
            keyRawName: 'NumPut',
            link: 'https://www.autohotkey.com/docs/commands/NumPut.htm',
            msg: 'Stores a number in binary format at the specified address+offset.',
        }],
        ['OBJADDREF', {
            group: 'Miscellaneous',
            keyRawName: 'ObjAddRef',
            link: 'https://www.autohotkey.com/docs/commands/ObjAddRef.htm',
            msg: 'Increments or decrements an object\'s [reference count](https://www.autohotkey.com/docs/Objects.htm#Reference_Counting).',
        }],
        ['OBJRELEASE', {
            group: 'Miscellaneous',
            keyRawName: 'ObjRelease',
            link: 'https://www.autohotkey.com/docs/commands/ObjAddRef.htm',
            msg: 'Increments or decrements an object\'s [reference count](https://www.autohotkey.com/docs/Objects.htm#Reference_Counting).',
        }],
        ['OBJBINDMETHOD', {
            group: 'Miscellaneous',
            keyRawName: 'ObjBindMethod',
            link: 'https://www.autohotkey.com/docs/commands/ObjBindMethod.htm',
            msg: 'Creates a [BoundFunc object](https://www.autohotkey.com/docs/objects/Functor.htm#BoundFunc) which calls a method of a given object.',
        }],
        ['OBJGETBASE', {
            group: 'Miscellaneous',
            keyRawName: 'ObjGetBase',
            link: 'https://www.autohotkey.com/docs/objects/Object.htm#GetBase',
            msg: 'Retrieves an object\'s [base object](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects).',
        }],
        ['OBJRAWGET', {
            group: 'Miscellaneous',
            keyRawName: 'ObjRawGet',
            link: 'https://www.autohotkey.com/docs/objects/Object.htm#RawGet',
            msg: 'Retrieves a key-value pair from an object, bypassing the object\'s [meta-functions](https://www.autohotkey.com/docs/Objects.htm#Meta_Functions).',
        }],
        ['OBJRAWSET', {
            group: 'Miscellaneous',
            keyRawName: 'ObjRawSet',
            link: 'https://www.autohotkey.com/docs/objects/Object.htm#RawSet',
            msg: 'Stores or overwrites a key-value pair in an object, bypassing the object\'s [meta-functions](https://www.autohotkey.com/docs/Objects.htm#Meta_Functions).',
        }],
        ['OBJSETBASE', {
            group: 'Miscellaneous',
            keyRawName: 'ObjSetBase',
            link: 'https://www.autohotkey.com/docs/objects/Object.htm#SetBase',
            msg: 'Sets an object\'s [base object](https://www.autohotkey.com/docs/Objects.htm#Custom_Objects).',
        }],
        ['OBJXXX', {
            group: 'Miscellaneous',
            keyRawName: 'ObjXXX',
            link: 'https://www.autohotkey.com/docs/objects/Object.htm',
            msg: 'Functions equivalent to the built-in methods of the Object type, such as [ObjInsertAt](https://www.autohotkey.com/docs/objects/Object.htm#InsertAt). It is usually recommended to use the corresponding method instead.',
        }],
        ['ONCLIPBOARDCHANGE', {
            group: 'Miscellaneous',
            keyRawName: 'OnClipboardChange',
            link: 'https://www.autohotkey.com/docs/commands/OnClipboardChange.htm#function',
            msg: 'Registers a function or [function object](https://www.autohotkey.com/docs/objects/Functor.htm) to run whenever the clipboard\'s content changes.',
        }],
        ['ONERROR', {
            group: 'Miscellaneous',
            keyRawName: 'OnError',
            link: 'https://www.autohotkey.com/docs/commands/OnError.htm',
            msg: 'Specifies a function to run automatically when an unhandled error occurs.',
        }],
        ['ONEXIT', {
            group: 'Miscellaneous',
            keyRawName: 'OnExit',
            link: 'https://www.autohotkey.com/docs/commands/OnExit.htm#function',
            msg: 'Specifies a function to run automatically when the script exits.',
        }],
        ['ONMESSAGE', {
            group: 'Miscellaneous',
            keyRawName: 'OnMessage',
            link: 'https://www.autohotkey.com/docs/commands/OnMessage.htm',
            msg: 'Monitors a message/event.',
        }],
        ['ORD', {
            group: 'Miscellaneous',
            keyRawName: 'Ord',
            link: 'https://www.autohotkey.com/docs/commands/Ord.htm',
            msg: 'Returns the ordinal value (numeric character code) of the first character in the specified string.',
        }],
        ['SB_XXX', {
            group: 'Miscellaneous',
            keyRawName: 'SB_XXX',
            link: 'https://www.autohotkey.com/docs/commands/GuiControls.htm#StatusBar_Functions',
            msg: 'Functions to add text/icons to or divide the bar of a StatusBar control.',
        }],
        ['STRGET', {
            group: 'Miscellaneous',
            keyRawName: 'StrGet',
            link: 'https://www.autohotkey.com/docs/commands/StrGet.htm',
            msg: 'Copies a string from a memory address, optionally converting it between code pages.',
        }],
        ['STRPUT', {
            group: 'Miscellaneous',
            keyRawName: 'StrPut',
            link: 'https://www.autohotkey.com/docs/commands/StrPut.htm',
            msg: 'Copies a string to a memory address, optionally converting it between code pages.',
        }],
        ['REGISTERCALLBACK', {
            group: 'Miscellaneous',
            keyRawName: 'RegisterCallback',
            link: 'https://www.autohotkey.com/docs/commands/RegisterCallback.htm',
            msg: 'Creates a machine-code address that when called, redirects the call to a function in the script.',
        }],
        ['TRIM', {
            group: 'Miscellaneous',
            keyRawName: 'Trim',
            link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
            msg: 'Trims characters from the beginning and/or end of a string.',
        }],
        ['LTRIM', {
            group: 'Miscellaneous',
            keyRawName: 'LTrim',
            link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
            msg: 'Trims characters from the beginning and/or end of a string.',
        }],
        ['RTRIM', {
            group: 'Miscellaneous',
            keyRawName: 'RTrim',
            link: 'https://www.autohotkey.com/docs/commands/Trim.htm',
            msg: 'Trims characters from the beginning and/or end of a string.',
        }],
        ['TV_XXX', {
            group: 'Miscellaneous',
            keyRawName: 'TV_XXX',
            link: 'https://www.autohotkey.com/docs/commands/TreeView.htm#BuiltIn',
            msg: 'Functions to add, modify or delete TreeView items, or to get data from them.',
        }],
        ['VARSETCAPACITY', {
            group: 'Miscellaneous',
            keyRawName: 'VarSetCapacity',
            link: 'https://www.autohotkey.com/docs/commands/VarSetCapacity.htm',
            msg: 'Enlarges a variable\'s holding capacity or frees its memory.',
        }],
        // ------------------------------------------------------------------------------------------------------------------
        // group :'Math'
        // ------------------------------------------------------------------------------------------------------------------
        ['ABS', {
            group: 'Math',
            keyRawName: 'Abs',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Abs',
            msg: ' Returns the absolute value of _Number_.',
        }],
        ['CEIL', {
            group: 'Math',
            keyRawName: 'Ceil',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Ceil',
            msg: ' Returns _Number_ rounded up to the nearest integer (without any .00 suffix).',
        }],
        ['EXP', {
            group: 'Math',
            keyRawName: 'Exp',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Exp',
            msg: ' Returns _e_ (which is approximately 2.71828182845905) raised to the _N_th power.',
        }],
        ['FLOOR', {
            group: 'Math',
            keyRawName: 'Floor',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Floor',
            msg: ' Returns _Number_ rounded down to the nearest integer (without any .00 suffix).',
        }],
        ['LOG', {
            group: 'Math',
            keyRawName: 'Log',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Log',
            msg: ' Returns the logarithm (base 10) of _Number_.',
        }],
        ['LN', {
            group: 'Math',
            keyRawName: 'Ln',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Ln',
            msg: ' Returns the natural logarithm (base e) of _Number_.',
        }],
        ['MAX', {
            group: 'Math',
            keyRawName: 'Max',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Max',
            msg: ' Returns the highest/lowest value of one or more numbers.',
        }],
        ['MIN', {
            group: 'Math',
            keyRawName: 'Min',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Min',
            msg: ' Returns the highest/lowest value of one or more numbers.',
        }],
        ['MOD', {
            group: 'Math',
            keyRawName: 'Mod',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Mod',
            msg: ' Returns the remainder when _Dividend_ is divided by _Divisor_.',
        }],
        ['ROUND', {
            group: 'Math',
            keyRawName: 'Round',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Round',
            msg: ' Returns _Number_ rounded to _N_ decimal places.',
        }],
        ['SQRT', {
            group: 'Math',
            keyRawName: 'Sqrt',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Sqrt',
            msg: ' Returns the square root of _Number_.',
        }],
        ['SIN', {
            group: 'Math',
            keyRawName: 'Sin',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Sin',
            msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        }],
        ['COS', {
            group: 'Math',
            keyRawName: 'Cos',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Cos',
            msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        }],
        ['TAN', {
            group: 'Math',
            keyRawName: 'Tan',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#Tan',
            msg: ' Returns the trigonometric sine/cosine/tangent of _Number_.',
        }],
        ['ASIN', {
            group: 'Math',
            keyRawName: 'ASin',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#ASin',
            msg: ' Returns the arcsine/arccosine/arctangent in radians.',
        }],
        ['ACOS', {
            group: 'Math',
            keyRawName: 'ACos',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#ACos',
            msg: ' Returns the arcsine/arccosine/arctangent in radians.',
        }],
        ['ATAN', {
            group: 'Math',
            keyRawName: 'ATan',
            link: 'https://www.autohotkey.com/docs/commands/Math.htm#ATan',
            msg: ' Returns the arcsine/arccosine/arctangent in radians.',
        }],
        // ------------------------------------------------------------------------------------------------------------------
        //  group: 'COM'
        // ------------------------------------------------------------------------------------------------------------------
        ['COMOBJACTIVE', {
            group: 'COM',
            keyRawName: 'ComObjActive',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Retrieves a registered COM object.',
        }],
        ['COMOBJARRAY', {
            group: 'COM',
            keyRawName: 'ComObjArray',
            link: 'https://www.autohotkey.com/docs/commands/ComObjArray.htm',
            msg: ' Creates a SAFEARRAY for use with COM.',
        }],
        ['COMOBJCONNECT', {
            group: 'COM',
            keyRawName: 'ComObjConnect',
            link: 'https://www.autohotkey.com/docs/commands/ComObjConnect.htm',
            msg: ' Connects a COM object\'s event sources to functions with a given prefix.',
        }],
        ['COMOBJCREATE', {
            group: 'COM',
            keyRawName: 'ComObjCreate',
            link: 'https://www.autohotkey.com/docs/commands/ComObjCreate.htm',
            msg: ' Creates a COM object.',
        }],
        ['COMOBJECT', {
            group: 'COM',
            keyRawName: 'ComObject',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Creates an object representing a typed value to be passed as a parameter or return value.',
        }],
        ['COMOBJENWRAP', {
            group: 'COM',
            keyRawName: 'ComObjEnwrap',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Wraps/unwraps a COM object.',
        }],
        ['COMOBJUNWRAP', {
            group: 'COM',
            keyRawName: 'ComObjUnwrap',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Wraps/unwraps a COM object.',
        }],
        ['COMOBJERROR', {
            group: 'COM',
            keyRawName: 'ComObjError',
            link: 'https://www.autohotkey.com/docs/commands/ComObjError.htm',
            msg: ' Enables or disables notification of COM errors.',
        }],
        ['COMOBJFLAGS', {
            group: 'COM',
            keyRawName: 'ComObjFlags',
            link: 'https://www.autohotkey.com/docs/commands/ComObjFlags.htm',
            msg: ' Retrieves or changes flags which control a COM wrapper object\'s behaviour.',
        }],
        ['COMOBJGET', {
            group: 'COM',
            keyRawName: 'ComObjGet',
            link: 'https://www.autohotkey.com/docs/commands/ComObjGet.htm',
            msg: ' Returns a reference to an object provided by a COM component.',
        }],
        ['COMOBJMISSING', {
            group: 'COM',
            keyRawName: 'ComObjMissing',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Creates a "missing parameter" object to pass to a COM method.',
        }],
        ['COMOBJPARAMETER', {
            group: 'COM',
            keyRawName: 'ComObjParameter',
            link: 'https://www.autohotkey.com/docs/commands/ComObjActive.htm',
            msg: ' Wraps a value and type to pass as a parameter to a COM method.',
        }],
        ['COMOBJQUERY', {
            group: 'COM',
            keyRawName: 'ComObjQuery',
            link: 'https://www.autohotkey.com/docs/commands/ComObjQuery.htm',
            msg: ' Queries a COM object for an interface or service.',
        }],
        ['COMOBJTYPE', {
            group: 'COM',
            keyRawName: 'ComObjType',
            link: 'https://www.autohotkey.com/docs/commands/ComObjType.htm',
            msg: ' Retrieves type information from a COM object.',
        }],
        ['COMOBJVALUE', {
            group: 'COM',
            keyRawName: 'ComObjValue',
            link: 'https://www.autohotkey.com/docs/commands/ComObjValue.htm',
            msg: ' Retrieves the value or pointer stored in a COM wrapper object.',
        }],
    ]),
);

function Bif2Md(BiFunc: TBuiltInFuncElement): vscode.MarkdownString {
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`Built-in Function (${BiFunc.group})`)
        .appendCodeblock(`${BiFunc.keyRawName}()`, 'ahk')
        .appendMarkdown(BiFunc.msg)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${BiFunc.link})`);

    const exp: string[] | undefined = BiFunc?.exp;
    if (exp && exp.length > 0) {
        md.appendMarkdown('\n\n*exp:*');
        for (const ex of exp) {
            md.appendCodeblock(ex);
        }
    }
    md.supportHtml = true;
    return md;
}

export const BuiltInFuncMDMap: ReadonlyMap<string, vscode.MarkdownString> = new Map(
    [...BuiltInFunctionMap]
        .map(([ukName, BiFunc]: [string, TBuiltInFuncElement]) => [ukName, Bif2Md(BiFunc)]),
);

export const BiFuncSnippetList: readonly vscode.CompletionItem[] = [...BuiltInFunctionMap]
    .map(([ukName, BiFunc]: [string, TBuiltInFuncElement]): vscode.CompletionItem => {
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${BiFunc.keyRawName}()`, // Left
            //  detail: v.class, // mid
            description: BiFunc.group, // Right
        });
        item.kind = vscode.CompletionItemKind.Function;
        item.insertText = new vscode.SnippetString(BiFunc?.insert ?? `${BiFunc.keyRawName}($1)`);

        item.detail = 'Built-in Function (neko-help)';
        item.documentation = BuiltInFuncMDMap.get(ukName) ?? Bif2Md(BiFunc);
        return item;
    });

// https://www.autohotkey.com/docs/Functions.htm#BuiltIn
