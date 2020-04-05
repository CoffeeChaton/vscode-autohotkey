# vscode-autohotkey-Outline

> Base of [ cweijan /vscode-autohotkey ](https://github.com/cweijan/vscode-autohotkey)

my telegram https://t.me/ceenekomimi

AutoHotKey language support for VS Code

* [Code Symbol](#CodeSymbol) and [Method Symbol](#MethodSymbol)
* [Goto Definition](#GotoDefinition)

## MethodSymbol
1. Detech source method as symbol
2. You can add a comment to the method using a semicolon on the previous line of the method
3. Now you can see "Splitting a Long Line into a Series of Shorter Ones" at Outline, but now can't GotoDefinition, i will fix it.
![methodSymbol](image/methodSymbol.jpg)
![methodSymbol2](image/methodSymbol2.png)


## CodeSymbol

1. You can add two semicolon to comment code block
![codeSymbole](image/codeSymbol.jpg)

2. You can see Leveled outline
 - function
 - for
 - class
 - loop
 - switch
![codeSymbole2](image/codeSymbol2.png)

3. Better view
 - Static Var
 - Return
 - Case
 - Default
 - GoSub
 - GoTo
 - Label
 - New
 - HotStr, like '::ahk,,::AutoHotkey'
 - HotKeys, like '~F12::'
 - directive, like '#Include' '#Warn' 
 - Global
 - Throw
![codeSymbole3](image/codeSymbol3.png)

## GotoDefinition

1. Press ctrl and move the mouse coordinates to the calling code 
![gotoDefinition](image/gotoDefinition.jpg)

## CodeFormat
1. Right click then click format document.
- **Formatter follows my coding habits, so it may not unsuited for you**.
- my style fork is not Formatter Label and Return.


