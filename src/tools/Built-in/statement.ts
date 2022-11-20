/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

import { EDiagCode } from '../../diag';

// FIXME: check this
type TStatementDiag =
    | EDiagCode.code806
    | EDiagCode.code899;

export type TStatementKeyList =
    | 'AND'
    | 'BETWEEN'
    | 'BREAK'
    | 'CASE'
    | 'CATCH'
    | 'CONTINUE'
    | 'DEFAULT'
    | 'ELSE'
    | 'FINALLY'
    | 'FOR'
    | 'GOSUB'
    | 'GOTO'
    | 'IF'
    | 'IFEQUAL'
    | 'IFEXIST'
    | 'IFGREATER'
    | 'IFGREATEROREQUAL'
    | 'IFINSTRING'
    | 'IFLESS'
    | 'IFLESSOREQUAL'
    | 'IFMSGBOX'
    | 'IFNOTEQUAL'
    | 'IFNOTEXIST'
    | 'IFNOTINSTRING'
    | 'IFWINACTIVE'
    | 'IFWINEXIST'
    | 'IFWINNOTACTIVE'
    | 'IFWINNOTEXIST'
    | 'IN'
    | 'IS'
    | 'LOOP'
    | 'NEW'
    | 'NOT'
    | 'OR'
    | 'RETURN'
    | 'SWITCH'
    | 'THIS'
    | 'THROW'
    | 'TRY'
    | 'UNTIL'
    | 'WHILE';
// Loop <file>

export type TStatementElement = {
    keyRawName: string;
    body: string;
    doc: string;

    recommended: boolean;
    link: `https://www.autohotkey.com/docs/${string}`;
    exp: readonly string[];
    diag?: TStatementDiag;
};

export type TStatement = {
    [k in TStatementKeyList]: TStatementElement;
};

/**
 * Flow of Control
 * FOC
 */
export const Statement: TStatement = {
    AND: {
        keyRawName: 'And',
        body: 'and',
        doc: 'Both of these are **logical-AND**. For example: `x > 3 and x < 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/Functions.htm#ShortCircuit) is applied. Also, a line that begins with AND/OR/&&/|| (or any other operator) is automatically [appended to](https://www.autohotkey.com/docs/Scripts.htm#continuation) the line above it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#and',
        exp: [
            ';exp of "And"',
            'x > 3 and x < 10',
            'x > 3 && x < 10',
            ';exp2',
            'if (Color = "Red" or Color = "Green" or Color = "Blue"        ; Comment.',
            '   or Color = "Black" or Color = "Gray" or Color = "White")   ; Comment.',
            '   and ProductIsAvailableInColor(Product, Color)              ; Comment.',
        ],
    },
    BETWEEN: {
        keyRawName: 'Between',
        body: 'between',
        doc: 'Determines whether [traditional assignments](https://www.autohotkey.com/docs/commands/SetEnv.htm "Deprecated. New scripts should use Var := Value instead.") like `Var1 = %Var2%` omit spaces and tabs from the beginning and end of _Var2_.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/AutoTrim.htm',
        exp: [
            'if Var Between LowerBound and UpperBound',
            'if Var not Between LowerBound and UpperBound',
            '; exp',
            'var := 2',
            'if var between 1 and 5',
            '    MsgBox, % var "is in the range 1 to 5, inclusive."',
        ],
    },
    BREAK: {
        keyRawName: 'Break',
        body: 'Break',
        doc: 'Exits (terminates) any type of [loop statement](https://www.autohotkey.com/docs/Language.htm#loop-statement).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Break.htm',
        exp: [
            'Break [, LoopLabel]',
            '',
            ';exp',
            'Loop',
            '{',
            '    ; ...',
            '    if (var > 25)',
            '        break',
            '    ; ...',
            '    if (var <= 5)',
            '        continue',
            '}',
        ],
    },
    CASE: {
        keyRawName: 'Case',
        body: 'Case $0:',
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
        ],
    },
    CATCH: {
        keyRawName: 'Catch',
        body: 'Catch, $0',
        doc: 'Specifies the code to execute if an exception is raised during execution of a [try](https://www.autohotkey.com/docs/commands/Try.htm) statement.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Catch.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    CONTINUE: {
        keyRawName: 'Continue',
        body: 'Continue',
        doc: 'Skips the rest of a [loop statement](https://www.autohotkey.com/docs/Language.htm#loop-statement)\'s current iteration and begins a new one.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Continue.htm',
        exp: [
            'Continue , LoopLabel',
            '',
            'Loop, 10',
            '{',
            '    if (A_Index <= 5)',
            '        continue',
            '    MsgBox %A_Index%',
            '}',
        ],
    },
    DEFAULT: {
        keyRawName: 'Default',
        body: 'Default : $0',
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
        ],
    },
    ELSE: {
        keyRawName: 'Else',
        body: 'else',
        link: 'https://www.autohotkey.com/docs/commands/Else.htm',

        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if an [If statement](https://www.autohotkey.com/docs/Language.htm#if-statement) evaluates to false.',
        recommended: true,
        exp: [
            '; exp of "Else"',
            'if (x = 1) {',
            '    ; ...',
            '} else if (x < y) {',
            '    ; ...',
            '} else {',
            '    ; ...',
            '}',
        ],
    },
    FINALLY: {
        keyRawName: 'Finally',
        body: 'Finally',
        doc: 'Ensures that one or more statements are always executed after a [Try](https://www.autohotkey.com/docs/commands/Try.htm) statement finishes.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Finally.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    FOR: {
        keyRawName: 'For',
        body: 'For ${1:Key}, ${2:Value} in ${3:Expression} {\n}',
        doc: 'Repeats a series of commands once for each key-value pair in an object.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/For.htm',
        exp: [
            'For Key [, Value] in Expression',
            ';',
            '; exp',
            'For Key , Value in ["A", "B", "C"] {',
            '    MsgBox % Key " & " Value',
            '}',
        ],
    },
    GOSUB: {
        keyRawName: 'Gosub',
        body: 'Gosub, ${1:Label}',
        doc: 'Jumps to the specified label and continues execution until [Return](https://www.autohotkey.com/docs/commands/Return.htm) is encountered.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Gosub.htm',
        exp: [
            'Gosub, Label1 ',
            '    MsgBox, The Label1 subroutine has returned (it is finished).',
            'return',
            '',
            'Label1:',
            '    MsgBox, The Label1 subroutine is now running.',
            'return',
        ],
    },
    GOTO: {
        keyRawName: 'Goto',
        body: 'Goto, ${1:Label}',
        doc: 'Jumps to the specified label and continues execution.',
        recommended: false,
        link: 'https://www.autohotkey.com/docs/commands/Goto.htm',
        exp: [
            'Goto, MyLabel',
            '',
            '; ...',
            '',
            'MyLabel:',
            '',
            'Sleep, 100',
            '; ...',
            '',
        ],
    },
    IF: {
        keyRawName: 'If',
        body: 'if ($0)',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions) evaluates to true.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfExpression.htm',
        exp: [
            '; exp of "If"',
            'if (x = 1) {',
            '    ; ...',
            '} else if (x < y) {',
            '    ; ...',
            '} else {',
            '    ; ...',
            '}',
        ],
    },
    IFEQUAL: {
        keyRawName: 'IfEqual',
        body: 'IfEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfEqual, Var , Value ; if Var = Value'],
    },
    IFEXIST: {
        keyRawName: 'IfExist',
        body: 'IfExist, ${1:FilePattern}',
        doc: 'Checks for the existence of a file or folder.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfExist.htm',
        exp: [
            'IfExist, FilePattern',
            'IfNotExist, FilePattern',
            '',
            ';exp',
            'IfExist, D:\\Docs\\*.txt',
            '    MsgBox, At least one .txt file exists.',
        ],
    },
    IFGREATER: {
        keyRawName: 'IfGreater',
        body: 'IfGreater, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfGreater, Var , Value ; if Var > Value'],
    },
    IFGREATEROREQUAL: {
        keyRawName: 'IfGreaterOrEqual',
        body: 'IfGreaterOrEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfGreaterOrEqual, Var , Value ; if Var >= Value'],
    },
    IFINSTRING: {
        keyRawName: 'IfInString',
        body: 'IfInString, ${1:Var}, ${2:SearchString}',
        doc: 'Checks if a [variable](https://www.autohotkey.com/docs/Variables.htm) contains the specified string.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfInString.htm',
        exp: [
            'IfInString, Var, SearchString',
            'IfNotInString, Var, SearchString',
        ],
    },
    IFLESS: {
        keyRawName: 'IfLess',
        body: 'IfLess, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfLess, Var , Value ; if Var < Value'],
    },
    IFLESSOREQUAL: {
        keyRawName: 'IfLessOrEqual',
        body: 'IfLessOrEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfLessOrEqual, Var , Value ; if Var <= Value'],
    },
    IFMSGBOX: {
        keyRawName: 'IfMsgBox',
        body: 'IfMsgBox, ${1|Yes,No,OK,Cancel,Abort,Ignore,Retry,Continue,TryAgain,Timeout|}',
        doc: 'Checks which button was pushed by the user during the most recent [MsgBox](https://www.autohotkey.com/docs/commands/MsgBox.htm) command.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfMsgBox.htm',
        exp: [
            'IfMsgBox, ButtonName',
        ],
    },
    IFNOTEQUAL: {
        keyRawName: 'IfNotEqual',
        body: 'IfNotEqual, ${1:Var} [, ${2:Value} ]',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if the comparison of a [variable](https://www.autohotkey.com/docs/Variables.htm) to a value evaluates to true.',
        recommended: false,
        diag: EDiagCode.code806,
        link: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
        exp: ['IfNotEqual, Var , Value ; if Var != Value'],
    },
    IFNOTEXIST: {
        keyRawName: 'IfNotExist',
        body: 'IfNotExist, ${1:FilePattern}',
        doc: 'Checks for the existence of a file or folder.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfExist.htm',
        exp: [
            'IfExist, FilePattern',
            'IfNotExist, FilePattern',
            '',
            ';exp',
            'IfExist, D:\\Docs\\*.txt',
            '    MsgBox, At least one .txt file exists.',
        ],
    },
    IFNOTINSTRING: {
        keyRawName: 'IfNotInString',
        body: 'IfNotInString, ${1:Var}, ${2:SearchString}',
        doc: 'Checks if a [variable](https://www.autohotkey.com/docs/Variables.htm) contains the specified string.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfInString.htm',
        exp: [
            'IfInString, Var, SearchString',
            'IfNotInString, Var, SearchString',
        ],
    },
    IFWINACTIVE: {
        keyRawName: 'IfWinActive',
        body: 'IfWinActive [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists and is currently active (foremost).',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
        exp: [
            'IfWinActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINEXIST: {
        keyRawName: 'IfWinExist',
        body: 'IfWinExist [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
        exp: [
            'IfWinExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINNOTACTIVE: {
        keyRawName: 'IfWinNotActive',
        body: 'IfWinNotActive [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists and is currently active (foremost).',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
        exp: [
            'IfWinActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotActive [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IFWINNOTEXIST: {
        keyRawName: 'IfWinNotExist',
        body: 'IfWinNotExist  [, ${1:WinTitle}, ${2:WinText}, ${3:ExcludeTitle}, ${4:ExcludeText}]',
        doc: 'Checks if the specified window exists.',
        recommended: false,
        diag: EDiagCode.code899,
        link: 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
        exp: [
            'IfWinExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
            'IfWinNotExist [, WinTitle, WinText, ExcludeTitle, ExcludeText]',
        ],
    },
    IN: {
        keyRawName: 'In',
        body: 'in',
        doc: '',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfIn.htm',
        exp: [
            ';EXP of If In',
            'if Var in MatchList',
            'if Var not in MatchList',
            '',
            'if Var contains MatchList',
            'if Var not contains MatchList',
        ],
    },
    IS: {
        keyRawName: 'Is',
        body: 'is',
        doc: '',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfIs.htm',
        exp: [
            ';EXP of If Is',
            'if Var is Type',
            'if Var is not Type',
        ],
    },
    LOOP: {
        keyRawName: 'Loop',
        body: 'Loop, ${1:number}',
        doc: 'Performs a series of commands repeatedly: either the specified number of times or until [break](https://www.autohotkey.com/docs/commands/Break.htm) is encountered.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Loop.htm',
        exp: [
            'Loop, 3 {',
            '    MsgBox, % "Iteration number is " A_Index "!"  ; A_Index will be 1, 2, then 3',
            '    Sleep, 100',
            '}',
            '; ---',
            'iMax := 5',
            'Loop, % iMax + 2 {',
            '    MsgBox, % "Iteration number is " A_Index "!" ; 1 to 7',
            '    Sleep, 100',
            '}',
            '',
            ';--- loop 0',
            'Loop, iMax { ; Count cannot be an expression, use %',
            '    MsgBox, % "never loop "  A_Index ; loop 0',
            '    Sleep, 100',
            '}',
            '',
        ],
    },
    NEW: {
        keyRawName: 'New',
        body: 'new',
        doc: 'Creates a new object derived from another object.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#new',
        exp: [
            'x := new y(z) ; (where y is a variable, not a function name)',
            '',
            '; https://www.autohotkey.com/docs/Objects.htm#Custom_NewDelete',
            'm1 := new GMem(0, 20)',
            '',
            'class GMem',
            '{',
            '    __New(aFlags, aSize)',
            '    {',
            '        this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")',
            '        if !this.ptr',
            '            return ""',
            '        MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."',
            '        return this  ; This line can be omitted when using the \'new\' operator.',
            '    }',
            '',
            '    __Delete()',
            '    {',
            '        MsgBox % "Delete GMem at address " this.ptr "."',
            '        DllCall("GlobalFree", "Ptr", this.ptr)',
            '    }',
            '}',
        ],
    },
    NOT: {
        keyRawName: 'Not',
        body: 'not',
        doc: '**Logical-NOT**. Except for its lower precedence, this is the same as the **!** operator.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#not',
        exp: [
            '; exp of "Not"',
            'not (x = 3 or y = 3)',
            '!(x = 3 or y = 3)',
        ],
    },
    OR: {
        keyRawName: 'Or',
        body: 'or',
        doc: 'Both of these are **logical-OR**. For example: `x <= 3 or x >= 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/Functions.htm#ShortCircuit) is applied.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#or',
        exp: [
            '; exp of "Or"',
            'x <= 3 or x >= 10',
            'x <= 3 || x >= 10',
        ],
    },
    RETURN: {
        keyRawName: 'Return',
        body: 'Return',
        doc: 'Returns from a subroutine to which execution had previously jumped via [function-call](https://www.autohotkey.com/docs/Functions.htm), [Gosub](https://www.autohotkey.com/docs/commands/Gosub.htm), [Hotkey](https://www.autohotkey.com/docs/Hotkeys.htm) activation, [GroupActivate](https://www.autohotkey.com/docs/commands/GroupActivate.htm), or other means.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Return.htm',
        exp: [
            '     Return 3',
            '     Return "literal string"',
            '     Return MyVar ',
            '     Return i + 1',
            '     Return true  ; Returns the number 1 to mean "true".',
            '     Return ItemCount < MaxItems  ; Returns a true or false value.',
            '     Return FindColor(TargetColor)',
        ],
    },
    SWITCH: {
        keyRawName: 'Switch',
        body: [
            'Switch ${1:key} {',
            '    Case ${2:val1}:',
            '        $0',
            '    Case ${3:val2}, ${4:val3}:',
            '        ',
            '    Default :',
            '        ',
            '}',
        ].join('\n'),
        doc: 'Executes one case from a list of mutually exclusive candidates.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Switch.htm',
        exp: [
            'Switch UserInput {',
            '    Case "btw":   MsgBox % "by the way"',
            '    Case "otoh":  MsgBox % "on the other hand"',
            '    Case "fl":    MsgBox % "Florida" Send, {backspace 3}Florida',
            '    Case "ca":    MsgBox % "California"  Send, {backspace 3}California',
            '    Case "ahk":   Run, % "https://www.autohotkey.com"',
            '    Default :     MsgBox % "default"',
            '}',
        ],
    },
    THIS: {
        keyRawName: 'This',
        body: 'this',
        doc: 'this ... i can\'t find documentation for "this"',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Objects.htm#Custom_NewDelete',
        exp: [
            'm1 := new GMem(0, 20)',
            '',
            'class GMem',
            '{',
            '    __New(aFlags, aSize)',
            '    {',
            '        this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")',
            '        if !this.ptr',
            '            return ""',
            '        MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."',
            '        return this  ; This line can be omitted when using the \'new\' operator.',
            '    }',
            '',
            '    __Delete()',
            '    {',
            '        MsgBox % "Delete GMem at address " this.ptr "."',
            '        DllCall("GlobalFree", "Ptr", this.ptr)',
            '    }',
            '}',
        ],
    },
    THROW: {
        keyRawName: 'Throw',
        body: 'Throw, Exception("${1:Message}" , ${2|"What",-1|}, "${3:Extra}")',
        doc: 'Signals the occurrence of an error. This signal can be caught by a [try](https://www.autohotkey.com/docs/commands/Try.htm)\\-[catch](https://www.autohotkey.com/docs/commands/Catch.htm) statement.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Throw.htm',
        exp: [
            'Throw 3',
            'Throw "literal string"',
            'Throw MyVar',
            'Throw i + 1',
            'Throw { what: "Custom error", file: A_LineFile, line: A_LineNumber } ; Throws an object',
        ],
    },
    TRY: {
        keyRawName: 'Try',
        body: 'Try',
        doc: 'Guards one or more statements (commands or expressions) against runtime errors and exceptions thrown by the [throw](https://www.autohotkey.com/docs/commands/Throw.htm) command.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Try.htm',
        exp: [
            'Try {',
            '    ...',
            '} Catch e {',
            '    ...',
            '} Finally {',
            '    ...',
            '}',
        ],
    },
    WHILE: {
        keyRawName: 'While',
        body: 'While ($0) {\n    \n}',
        doc: 'Performs a series of commands repeatedly until the specified [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions) evaluates to false.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/While.htm',
        exp: [
            ';exp1 As the user drags the left mouse button, a tooltip displays the size of the region inside the drag-area.',
            '',
            'CoordMode, Mouse, Screen',
            '',
            '~LButton::fn_lb1()',
            '',
            'fn_lb1(){',
            '    MouseGetPos, begin_x, begin_y',
            '    While GetKeyState("LButton")',
            '    {',
            '        MouseGetPos, x, y',
            '        ToolTip, % begin_x ", " begin_y "`n" Abs(begin_x-x) " x " Abs(begin_y-y)',
            '        Sleep, 10',
            '    }',
            '    ToolTip',
            '}',
        ],
    },
    UNTIL: {
        keyRawName: 'Until',
        body: 'Until $0',
        doc: 'Applies a condition to the continuation of a Loop or For-loop.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Until.htm',
        exp: [
            'Loop {',
            '    ...',
            '} Until Expression',
        ],
    },
};
