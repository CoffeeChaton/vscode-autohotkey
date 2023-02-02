# TODO TODO list

- [add test of tmLanguage.json](https://github.com/Microsoft/TypeScript-TmLanguage)
- [diag of `If Var op Value`](https://www.autohotkey.com/docs/v1/Language.htm#if-statement)
- [not use switch in js](https://github.com/microsoft/TypeScript/pull/50225)
- add `RegExMatch((Text := q.Read()), "OU)([^\x00-\x7F])", Found)` of `Found`...
- add diag auto check of `catch{} ;null catch`
- add diag `OnMessage(MsgNumber , fn)` fn-param-lint
- add diag of `%\w%\w`
- add hover of `;@ahk-neko-ignore`
- fix: syntax-highlight
  <details>
    <summary>exp code</summary>

  ```ahk
  GetKeyState(WhichKey, Mode = "") {
      GetKeyState, v, %WhichKey%, %Mode%
      Return, v
  }
  ```

  </details>

- TODO check this mean [A_EventInfo](https://www.autohotkey.com/docs/v1/Variables.htm#EventInfo)
  >
  > - The OnClipboardChange label
  > - Mouse wheel hotkeys (WheelDown/Up/Left/Right)
  > - OnMessage()
  > - RegisterCallback()
  > - Regular Expression Callouts
  > - GUI events, namely GuiContextMenu, GuiDropFiles, ListBox, ListView, TreeView, and StatusBar. If there is no additional information for an event, A_EventInfo contains 0.

- fix: label/func match with `Menu`

  ```ahk
  Menu, MenuName, Add , MenuItemName, LabelOrSubmenu, Options
  ;                                   ^
  Menu, MenuName, Insert , MenuItemName, ItemToInsert, LabelOrSubmenu, Options
  ;                                                       ^
  ```

- hover var-doc as jsdoc-style

  ```ahk
  fun(cc){

      /**
      * jsdoc-style
      */
      bb := 0 ;; cpp-style

      ; hover var-name and show doc
      ; OK use `;;` to add cpp-style
      ; TODO add jsdoc-style
  }
  ```

- [info magic of `,`](https://www.autohotkey.com/docs/v1/Variables.htm#comma) ex: `x:=1, y=2, a=b=c` or `x:=1, %y%=2`
- Parser: -> AST
- Scanner: -> Token
- test of <https://www.autohotkey.com/docs/v1/scripts/index.htm>
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
<https://www.autohotkey.com/docs/v1/lib/index.htm>

Object
<https://www.autohotkey.com/docs/v1/lib/RegExMatch.htm#MatchObject>

<!-- - not add file Watcher!
  >
  > - The file watcher only real purpose is to watch for files that might change outside of VSCode.<https://github.com/Gruntfuggly/todo-tree/issues/636#issuecomment-1343341793>
  > - Even M$, it took a lot of time to announce the use of<https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-beta/#file-watching-changes> -->
