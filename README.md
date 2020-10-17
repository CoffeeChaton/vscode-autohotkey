# vscode-autohotkey-NekoHelp

> Base of [cweijan /vscode-autohotkey](https://github.com/cweijan/vscode-autohotkey)

AutoHotKey language support for VS Code

-   [vscode-autohotkey-NekoHelp](#vscode-autohotkey-nekohelp)
    -   [FunctionSymbol](#FunctionSymbol)
    -   [CodeSymbol](#codesymbol)
    -   [GotoDefinition](#gotodefinition)
    -   [Hover](#hover)
    -   [CodeFormat](#codeformat)
        <!-- -   [IntelliSense](#IntelliSense) -->

## FunctionSymbol

1. Detect source Function as symbol
2. Now you can see "Splitting a Long Line into a Series of Shorter Ones" at Outline.
   https://www.autohotkey.com/docs/Scripts.htm#continuation
   ![FunctionSymbol](image/FunctionSymbol.png)

## CodeSymbol

1. You can add two semicolon `;;` to comment line
   or add `{ ;;` to comment code block.

    ![codeSymbol](image/codeSymbol.png)

2. You can see Leveled outline

-   class
-   function
-   Return
-   switch, Case, Default
-   Static Var
-   Global Var
-   Labels, like `this_is_a_label:`
-   HotString, like `::ahk::`
-   HotKeys, like `~F12::`
-   directive, like `#Include` or `#Warn`
-   Throw
    ![codeSymbol3](image/codeSymbol3.jpg)

## GotoDefinition

1. Go to Definition (via `F12` or `Ctrl+Click`)
2. open the definition to the side with ( via `Ctrl+Alt+Click` )
3. Peek Definition (via `Alt+F12`)
4. Go to References (via `shift+F12`)
   ![ListAllReferences](image/ListAllReferences.jpg)

## Hover

1. Hover function to show return value or comment

    ![hover2](image/hover2.jpg)

2. how to add comment of function ?

```ahk
/**
    ; in /** block.
    ; and the line first character is '@'
    ; can use partial grammar of markdown.
    ; exp@email.com
    ; [Markdown Rule](https://en.wikipedia.org/wiki/Markdown)
    ; <https://en.wikipedia.org/wiki/Markdown>
    ; ![Image](/D:/icon.png "icon")
    ; ~~ABC~~
    ; _ABC_ _ABC_
    ; - - -
    ;  `monospace`
*/
```

## CodeFormat

1. Right click then click format document.
2. or `alt` + `shift` + `f`
3. add switch case format

-   **beta test now.**

![fmt](image/fmt.png)

<!-- ## IntelliSense

![IntelliSense For Class](image/IntelliSenseForClass.gif) -->
