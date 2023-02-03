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
}

MsgBox % "suggest to use ctrl + shift + f to search other case" 
TODO() { ; TODO func-Ref-case
    ;https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events 
    ;[v1.1.20 +]: If not a valid label name, a function name can be used instead

    ;https://www.autohotkey.com/docs/v1/lib/Sort.htm#Options
    ;[v1.1.20+]: If it is not the name of an existing label, LabelOrSubmenu can be the name of a function

    ;https://www.autohotkey.com/docs/v1/lib/Menu.htm#Add
    ;F MyFunction [v1.0.47+]: Uses custom sorting according to the criteria in MyFunction


    ; <https://www.autohotkey.com/docs/v1/misc/Labels.htm#Functions
    ; - TODO [Gui events](https://www.autohotkey.com/docs/v1/lib/Gui.htm#Labels) such as GuiClose
    ; - TODO [Gui control events](https://www.autohotkey.com/docs/v1/lib/Gui.htm#label) (g-labels)
    ; - TODO [Menu](https://www.autohotkey.com/docs/v1/lib/Menu.htm#Functor)
    ; - OK   [SetTimer](https://www.autohotkey.com/docs/v1/lib/SetTimer.htm#Functor)
    ; - OK   [Hotkey](https://www.autohotkey.com/docs/v1/lib/Hotkey.htm#Functor)
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
