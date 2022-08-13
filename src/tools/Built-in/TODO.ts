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

// TODO CommandList
// Edit
// EnvDiv
// EnvMult
// EnvUpdate
// ExitApp
// FileAppend
// Gosub
// Goto
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
