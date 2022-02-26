/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
import { DeepReadonly } from './globalEnum';

// export const enum EDADiagCode {
//     DACode501 = 'DA501', // 501~599 Analysis Func or Method
//     DACode502 = 'DA502', // case sensitivity
// }

// export const DADiag = {
//     DA501: {
//         msg: 'args is assigned but never used.',
//         path: 'https://www.autohotkey.com/docs/Functions.htm',
//     },
//     DA502: {
//         msg: 'case sensitivity',
//         path: 'https://www.autohotkey.com/docs/Concepts.htm#names',
//     },
// };

export const enum EDiagCodeDA {
    // 501~599 Analysis Func or Method
    code501 = 501, // param is assigned but never used.
    code502 = 502, // var case sensitivity
    code503 = 503, // param case sensitivity
}

export type TDiagsDA = {
    [k in EDiagCodeDA]: {
        msg: string;
        path: string;
    };
};

export const DiagsDA: DeepReadonly<TDiagsDA> = {
    501: {
        msg: 'param is assigned but never used.',
        path: 'https://www.autohotkey.com/docs/Functions.htm',
    },
    502: {
        msg: 'var case sensitivity',
        path: 'https://www.autohotkey.com/docs/Concepts.htm#names',
    },
    503: {
        msg: 'param case sensitivity',
        path: 'https://www.autohotkey.com/docs/Concepts.htm#names',
    },
};

export const enum EDiagCode {
    code107 = 107,
    code110 = 110, // 100~110 is switch err
    code111 = 111,
    code112 = 112,
    code113 = 113,
    code114 = 114,
    code201 = 201, // 200~299 is not expression // need use %
    code301 = 301, // 300~399 is func err
    code700 = 700, // 700 is Command -> func
    // code701 = 701, // 701~799 is Command error
    // 800~899 is Deprecated / Old Syntax
    code801 = 801,
    code802 = 802,
    code803 = 803,
    code804 = 804,
    code805 = 805,
    code806 = 806,
    code807 = 807,
    code808 = 808,
    code809 = 809,
    code810 = 810,
    code811 = 811,
    code812 = 812,
    code813 = 813,
    code814 = 814,
    code815 = 815,
    code816 = 816,
    code817 = 817,
    code818 = 818,
    code819 = 819,
    code820 = 820,
    code821 = 821,
    code822 = 822,
    code823 = 823,
    code824 = 824,
    // 901~999 is not recommended
    code901 = 901,
    code902 = 902,
    code903 = 903,
}

export type TDiags = {
    [k in EDiagCode]: {
        msg: string;
        path: string;
    };
};

export const Diags: DeepReadonly<TDiags> = {
    107: {
        msg: 'assign warning',
        path: 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    },
    110: {
        msg: 'default : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    111: {
        msg: 'default : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    112: {
        msg: 'Case : > 20',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    113: {
        msg: 'Case : not find ',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    114: {
        msg: 'switch name not find',
        path: 'https://www.autohotkey.com/docs/commands/Switch.htm',
    },
    201: {
        msg: 'Count cannot be an expression, use %',
        path: 'https://www.autohotkey.com/docs/commands/Loop.htm',
    },
    301: {
        msg: 'function or Method is so big',
        path: 'https://www.autohotkey.com/docs/Functions.htm',
    },
    700: {
        msg: 'try to use function replace Command(obsolete code)',
        path: 'https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
    },
    801: {
        msg: 'Old Syntax(obsolete code)',
        path: 'https://www.autohotkey.com/docs/commands/LoopReg.htm#old',
    },
    802: {
        msg: 'Old Syntax(obsolete code)',
        path: 'https://www.autohotkey.com/docs/commands/LoopFile.htm#old',
    },
    803: {
        msg: 'Use `Var := Var / Value` or `Var /= Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/EnvDiv.htm',
    },
    804: {
        msg: 'Use `Var := Var * Value` or `Var *= Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/EnvMult.htm',
    },
    805: {
        msg: 'Use the `GetKeyState()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#command',
    },
    806: {
        msg: 'Use `If (expression)` instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
    },
    807: {
        msg: 'Use the `FileExist()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfExist.htm',
    },
    808: {
        msg: 'Use the `InStr()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfInString.htm',
    },
    809: {
        msg: 'Use the `WinActive()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
    },
    810: {
        msg: 'Use the `WinExist()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
    },
    811: {
        msg: 'Use the `OnClipboardChange()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/OnClipboardChange.htm#label',
    },
    812: {
        msg: 'Use the `OnExit()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/OnExit.htm#command',
    },
    813: {
        msg: 'Use the `Gui,` command instead.',
        path: 'https://www.autohotkey.com/docs/commands/Progress.htm',
    },
    814: {
        msg: 'Use expression assignments like `Var := Value` instead.',
        path: 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    },
    815: {
        msg: 'Use the `Format()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/SetFormat.htm',
    },
    816: {
        msg: 'Use the `Gui` command instead.',
        path: 'https://www.autohotkey.com/docs/commands/SplashTextOn.htm',
    },
    817: {
        msg: 'Use the `InStr()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringGetPos.htm',
    },
    818: {
        msg: 'Use the `SubStr()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
    },
    819: {
        msg: 'Use the `StrLen()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringLen.htm',
    },
    820: {
        msg: 'Use the `SubStr()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringMid.htm',
    },
    821: {
        msg: 'Use the `StrReplace()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringReplace.htm',
    },
    822: {
        msg: 'Use the `StrSplit()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringSplit.htm',
    },
    823: {
        msg: 'Use the `SubStr()` function instead.',
        path: 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
    },
    824: {
        msg: 'Deprecated: This command is not recommended for use in new scripts.',
        path: 'https://www.autohotkey.com/docs/commands/Transform.htm',
    },
    901: {
        msg: 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
        path: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm',
    },
    902: {
        msg: 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
        path: 'https://www.autohotkey.com/docs/commands/_CommentFlag.htm',
    },
    903: {
        msg: 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
        path: 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related',
    },
};
