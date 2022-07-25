/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

// TODO snippets/ahk.snippets.json
export type TStatementKeyList =
    | 'AND'
    | 'BREAK'
    | 'CASE'
    | 'CATCH'
    | 'CONTINUE'
    | 'DEFAULT'
    | 'ELSE'
    | 'FINALLY'
    | 'FOR'
    | 'IF'
    | 'LOOP'
    | 'OR'
    | 'PAUSE'
    | 'RELOAD'
    | 'RETURN'
    | 'SWITCH'
    | 'THROW'
    | 'TRY'
    | 'UNTIL'
    | 'WHILE';
// Loop <file>

export type TStatementElement<T extends TStatementKeyList> = {
    keyRawName: Capitalize<Lowercase<T>>;
    body: string;
    doc: string;

    recommended: boolean;
    link: string;
    exp: string[];
};

export type TStatement = {
    [k in TStatementKeyList]: TStatementElement<k>;
};

export const Statement: TStatement = {
    AND: {
        keyRawName: 'And',
        body: 'And',
        doc: 'Both of these are **logical-AND**. For example: `x > 3 and x < 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/Functions.htm#ShortCircuit) is applied. Also, a line that begins with AND/OR/&&/|| (or any other operator) is automatically [appended to](https://www.autohotkey.com/docs/Scripts.htm#continuation) the line above it.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#and',
        exp: [
            'x > 3 And x < 10',
            'x > 3 && x < 10',
            ';exp2',
            'if (Color = "Red" or Color = "Green"  or Color = "Blue"   ; Comment.',
            '   or Color = "Black" or Color = "Gray" or Color = "White")   ; Comment.',
            '   and ProductIsAvailableInColor(Product, Color)   ; Comment.',
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
        body: 'Case ',
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
            'Continue [, LoopLabel]',
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
    DEFAULT: {
        keyRawName: 'Default',
        body: 'Default',
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
        body: 'Else',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if an [If statement](https://www.autohotkey.com/docs/Language.htm#if-statement) evaluates to false.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Else.htm',
        exp: [
            'If (x = 1) {',
            '    ; ...',
            '} Else If (x < y) {',
            '    ; ...',
            '} Else {',
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
    IF: {
        keyRawName: 'If',
        body: 'If ($0)',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if an [expression](https://www.autohotkey.com/docs/Variables.htm#Expressions) evaluates to true.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/IfExpression.htm',
        exp: [
            'If (x = 1) {',
            '    ; ...',
            '} Else If (x < y) {',
            '    ; ...',
            '} Else {',
            '    ; ...',
            '}',
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
            '    MsgBox, Iteration number is %A_Index%.  ; A_Index will be 1, 2, then 3',
            '    Sleep, 100',
            '}',
        ],
    },
    OR: {
        keyRawName: 'Or',
        body: 'Or',
        doc: 'Both of these are **logical-OR**. For example: `x <= 3 or x >= 10`. To enhance performance, [short-circuit evaluation](https://www.autohotkey.com/docs/Functions.htm#ShortCircuit) is applied.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#or',
        exp: [
            'x <= 3 Or x >= 10',
            'x <= 3 || x >= 10',
        ],
    },
    PAUSE: {
        keyRawName: 'Pause',
        body: 'Pause',
        doc: 'Pauses the script\'s [current thread](https://www.autohotkey.com/docs/misc/Threads.htm).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Pause.htm',
        exp: [
            'Pause , OnOffToggle, OperateOnUnderlyingThread',
            '; exp',
            'Pause::Pause  ; The Pause/Break key.',
            '#p::Pause  ; Win+P',
        ],
    },
    RELOAD: {
        keyRawName: 'Reload',
        body: 'Reload',
        doc: 'Replaces the currently running instance of the script with a new one.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Reload.htm',
        exp: [
            '^!r::Reload  ; Ctrl+Alt+R',
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
            'Case ${2:val1}:',
            '    $0',
            'Case ${3:val2}, ${4:val3}:',
            '    ',
            'Default :',
            '    ',
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
    THROW: {
        keyRawName: 'Throw',
        body: 'Throw , $0',
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
};
