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
} as const;

// ${3|Seconds,Minutes,Hours,Days|}
// Var *Script::FindOrAddVar(LPTSTR aVarName, size_t aVarNameLength, int aScope)
