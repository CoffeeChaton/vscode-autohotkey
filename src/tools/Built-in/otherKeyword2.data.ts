/* eslint-disable max-len */

type TOtherKeywordElement = {
    upName: string;
    keyRawName: string;
    body: string;
    doc: string;

    recommended: boolean;
    link: `https://www.autohotkey.com/docs/${string}`;
    exp: readonly string[];
};

/**
 * after initialization clear
 */
export const otherKeyword2: TOtherKeywordElement[] = [
    {
        upName: 'AND',
        keyRawName: 'and',
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
    {
        upName: 'BETWEEN',
        keyRawName: 'Between',
        body: 'between',
        doc: 'Determines whether [traditional assignments](https://www.autohotkey.com/docs/commands/SetEnv.htm "Deprecated. New scripts should use Var := Value instead.") like `Var1 = %Var2%` omit spaces and tabs from the beginning and end of _Var2_.',
        recommended: true,
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
    {
        upName: 'IN',
        keyRawName: 'in',
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
    {
        upName: 'IS',
        keyRawName: 'is',
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
    {
        upName: 'NEW',
        keyRawName: 'new',
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
    {
        upName: 'NOT',
        keyRawName: 'not',
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
    {
        upName: 'OR',
        keyRawName: 'or',
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
];
