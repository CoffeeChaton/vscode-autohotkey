/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */

export type TStatementKeyList =
    | 'AND'
    | 'CONTINUE'
    | 'ELSE'
    | 'FALSE'
    | 'IF'
    | 'IN'
    | 'IS'
    | 'NEW'
    | 'NOT'
    | 'OR'
    | 'THIS'
    | 'TRUE';
// Loop <file>

export type TStatementElement<T extends TStatementKeyList> = {
    keyRawName: Capitalize<Lowercase<T>>;
    body: string;
    doc: string;

    recommended: boolean;
    link: `https://www.autohotkey.com/docs/${string}`;
    exp: string[];
};

export type TStatement = {
    [k in TStatementKeyList]: TStatementElement<k>;
};

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
    CONTINUE: {
        keyRawName: 'Continue',
        body: 'continue',
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
    ELSE: {
        keyRawName: 'Else',
        body: 'else',
        doc: 'Specifies one or more [statements](https://www.autohotkey.com/docs/Concepts.htm#statement) to execute if an [If statement](https://www.autohotkey.com/docs/Language.htm#if-statement) evaluates to false.',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/commands/Else.htm',
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
    FALSE: {
        keyRawName: 'False',
        body: 'false',
        doc: '`0` to represent `false`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/Concepts.htm#boolean).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        exp: [
            'False',
            'false',
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
    TRUE: {
        keyRawName: 'True',
        body: 'true',
        doc: '`1` to represent `true`. They can be used to make a script more readable. For details, see [Boolean Values](https://www.autohotkey.com/docs/Concepts.htm#boolean).',
        recommended: true,
        link: 'https://www.autohotkey.com/docs/Variables.htm#misc',
        exp: [
            'true',
            'True',
        ],
    },
};
