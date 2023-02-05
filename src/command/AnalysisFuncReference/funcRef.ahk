funcName() {
    ;save this file to try gotoDef && find-all-references
    Return "ABC"
}
exp1() {
    funcName := funcName() ;
    ;X          ^
    ;var-name   ref-with-style1
    ;ahk-v1 is allow var-name lookLike functionName

    someString := "funcName"
    ;              ^
    fnObj := func(someString)
    fnObj := RegisterCallback(someString)
    OnMessage(MsgNumber, someString)
    ; sometime we need to use str -> func(str) / RegisterCallback(str)

    MsgBox % "funcName" funcName funcName() "funcName" funcName funcName "funcName("
    ;         ^         X        ^           ^         X        X         X
}

exp2() {

    Hotkey, KeyName , funcName, Options
    ;                 ^------------------label || func || funcObj
    ;Hotkey, IfWinActive/Exist , WinTitle, WinText ; Not-func-ref of this cmd line
    ;Hotkey, If , Expression ; Not-func-ref of this cmd line
    ;Hotkey, If, % FunctionObject ; Not-func-ref of this cmd line

    SetTimer , funcName, PeriodOnOffDelete, Priority
    ;            ^-----------------------label || func || funcObj
    Menu, MenuName, Add , MenuItemName, funcName, Options
    ;                                   ^-----------------------label || func || funcObj 
    Menu, MenuName, Add , funcName ;If LabelOrSubmenu is omitted, MenuItemName will be used as both the label and the menu item's name.
    ;                     ^-----------------------label || func || funcObj 
}

MsgBox % "suggest to use ctrl + shift + f to search other case" 
TODO() { ; TODO func-Ref-case
    ;Sort F-flag https://www.autohotkey.com/docs/v1/lib/Sort.htm#Options
    ;F MyFunction [v1.0.47+]

    ; <https://www.autohotkey.com/docs/v1/misc/Labels.htm#Functions
    ; - TODO [Gui events](https://www.autohotkey.com/docs/v1/lib/Gui.htm#Labels) such as GuiClose
}

notPlanToSupport() {
    ;NOT plan to support-----------------------
    ;https://www.autohotkey.com/docs/v1/Objects.htm#Function_References
    RetVal := %Func%(Params) ; Requires [v1.1.07+]
    RetVal := Func.Call(Params) ; Requires [v1.1.19+]
    RetVal := Func.(Params) ; Not recommended

    ;https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions
    RegExMatch(Haystack, "i)(The) (\w+)\b(?CCallout)")
    ;                                         ^Callout

    ;https://www.autohotkey.com/docs/v1/Variables.htm#ref
    cc := fn%i%() ;
}
