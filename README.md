# vscode-autohotkey-NekoHelp

> Base of [cweijan /vscode-autohotkey](https://github.com/cweijan/vscode-autohotkey)

AutoHotKey language support for VS Code

-   [vscode-autohotkey-NekoHelp](#vscode-autohotkey-nekohelp)
    -   [FunctionSymbol](#FunctionSymbol)
    -   [CodeSymbol](#codesymbol)
    -   [GotoDefinition](#gotodefinition)
    -   [Hover](#hover)
    -   [CodeFormat](#codeformat)
    -   [Diagnostic](#Diagnostic) **new!**
    -   [IntelliSense](#IntelliSense) **new**

## FunctionSymbol

1. Detect source Function as symbol
2. support [continuation](https://www.autohotkey.com/docs/Scripts.htm#continuation) at Outline.
   ![FunctionSymbol](image/FunctionSymbol.png)

## CodeSymbol

1. You can add two semicolon `;;` to comment line
   or add `{ ;;` to comment code block.

    ![codeSymbol](image/codeSymbol4.png)

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
    ; and the line first character is ';'
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

![hover3](image/hover3.png)

## CodeFormat

1. Right click then click format document.
2. or `alt` + `shift` + `f`
3. add switch case format

-   **beta test now.**

![fmt](image/fmt.png)

<!-- ## IntelliSense

![IntelliSense For Class](image/IntelliSenseForClass.gif) -->

## Diagnostic

1. warning about use `=` not `:=` to assign.
2. warning of Switch  
   `default : not find `  
   `default : too much`  
   `Case : > 20`  
   `Case : not find `
3. use `;@ahk-ignore [number] line.` to ignore,  
   exp: `;@ahk-ignore 3 line.`

![Diagnostic1](image/Diagnostic1.png)
![Diagnostic2](image/Diagnostic2.png)

## IntelliSense

1. Snippets of your function.
   ![IntelliSenseFunc](image/IntelliSenseFunc.gif)
