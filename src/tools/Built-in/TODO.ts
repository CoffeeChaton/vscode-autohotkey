//
// BUILT-IN VARIABLES //
//

// Declare built-in var read function.
// #define BIV_DECL_R(name) VarSizeType name(LPTSTR aBuf, LPTSTR aVarName)

// TODO fn()
// ComObjParameter
// IsByRef()
// ObjAddRef()
// ObjBindMethod()
// ObjClone()
// ObjClone()
// ObjCount()
// ObjCount()
// ObjDelete()
// ObjGetAddress()
// ObjGetBase()
// ObjGetCapacity()
// ObjHasKey()
// ObjInsert()
// ObjInsertAt()
// ObjLength()
// ObjMaxIndex()
// ObjMinIndex()
// ObjNewEnum()
// ObjPop()
// ObjPush()
// ObjRawGet()
// ObjRawSet()
// ObjRelease()
// ObjRemove()
// ObjRemoveAt()
// ObjSetCapacity()

// -------
// ObjClone()
// ObjCount()
// ObjDelete()
// ObjGetAddress()
// ObjGetCapacity()
// ObjHasKey()
// ObjInsert()
// ObjInsertAt()
// ObjLength()
// ObjMaxIndex()
// ObjMinIndex()
// ObjNewEnum()
// ObjPop()
// ObjPush()
// ObjRemove()
// ObjRemoveAt()
// ObjSetCapacity()
// These functions are equivalent to built-in methods of the Object type. It is usually recommended to use the corresponding method instead.

// TODO CommandList
// EnvDiv
// EnvMult
// FileAppend
// IfEqual
// IfExist
// IfGreater
// IfGreaterOrEqual
// IfInString
// IfLess
// IfLessOrEqual
// IfMsgBox
// IfNotEqual
// IfNotExist
// IfNotInString
// IfWinActive
// IfWinExist
// IfWinNotActive
// IfWinNotExist
// ListHotkeys
// ListVars
// Progress
// SetEnv
// SplashImage
// SplashTextOff
// StringSplit

const TODO = {
    Clipboard: {
        body: 'Clipboard',
        group: 'Misc.',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
    },
    ClipboardAll: {
        body: 'ClipboardAll',
        group: 'Misc.',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
    },
    ErrorLevel: {
        body: 'ErrorLevel',
        group: 'Misc.',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
    },
    False: {
        body: 'False',
        group: 'Misc.',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
    },
    True: {
        body: 'True',
        group: 'Misc.',
        uri: 'https://www.autohotkey.com/docs/Variables.htm#misc',
    },
} as const;

// ${3|Seconds,Minutes,Hours,Days|}
