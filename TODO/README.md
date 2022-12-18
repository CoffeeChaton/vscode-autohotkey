# TODO TODO list

- [add test of tmLanguage.json](https://github.com/Microsoft/TypeScript-TmLanguage)
- [diag of `If Var op Value`](https://www.autohotkey.com/docs/Language.htm#if-statement)
- [not use switch in js](https://github.com/microsoft/TypeScript/pull/50225)
- add `RegExMatch((Text := q.Read()), "OU)([^\x00-\x7F])", Found)` of `Found`...
- add diag auto check of `catch{} ;null catch`
- add diag of `%\w%\w`
- add hover of `;@ahk-neko-ignore`
- add test jest of `package.json.config` <---> `configUI.ts`
- change `configUI.ts` fmt option to `enum`
- list all func add some Data at tail
- Parser: -> AST
- Scanner: -> Token
- test of <https://www.autohotkey.com/docs/scripts/index.htm>
- move some `.ts` -> `ahk-doc.json`
- add: support of `user-def-.h.ahk`
- test: add vscode.test
- add diag of [The "is" operator is not supported in expressions.](https://www.autohotkey.com/boards/viewtopic.php?f=76&t=111131)
- auto-fix of code107

```ahk
a = %i%
a = 0
a =
a = -5
a = 0x25
```

```ahk
Loop, Parse, clipboard, `n, `r
{
    MsgBox, 4, ,% "File number " A_Index " is " A_LoopField ".`n`nContinue?"
    IfMsgBox, No, break
    ;______________^
}
```

// TODO obj fn()

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
<https://www.autohotkey.com/docs/lib/index.htm>

Object
<https://www.autohotkey.com/docs/lib/RegExMatch.htm#MatchObject>
