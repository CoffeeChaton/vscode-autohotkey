[theme-color](https://code.visualstudio.com/api/references/theme-color)
[Naming Conventions](https://macromates.com/manual/en/language_grammars)

1. [syntax-highlight](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#semantic-theming)
2. [semantic-highlight](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)

[numbers-highlight](https://www.autohotkey.com/docs/Concepts.htm#numbers)

```c++
// this block is ahk...but i need c++ style highlight in md.
123, 00123 or -1
0x7B, 0x007B or -0x1
3.14159
0x001
1.0e4 and -2.1E-4

    -9223372036854775808 (-0x8000000000000000)
    +9223372036854775807 (0x7FFFFFFFFFFFFFFF)

Sleep 0xFF
Sleep 255
06.0 

Var := 11.333333
6.2
Var -= 1
10.33 
0.2
11.33 
06.0
000011

Var += 0  
11
0xb
Round(3.333, 1)+0.0

0.17 
MsgBox % 0.1 + 0
0.10000000000000001
MsgBox % 0.1 + 0.2
0.30000000000000004
MsgBox % 0.3 + 0
0.29999999999999999
MsgBox % 0.1 + 0.2 = 0.3

MsgBox % Abs((0.1 + 0.2) - (0.3)) < 0.0000000000000001
MsgBox % Round(0.1 + 0.2, 15) = Format("{:.15f}", 0.3)
```
