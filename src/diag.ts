/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
import { DeepReadonly } from './globalEnum';

export const enum EDiagCodeDA {
    // 501~599 Analysis Func or Method
    code501 = 501, // param is assigned but never used.
    code502 = 502, // var/param case sensitivity
    code504 = 504, // Variadic param * >1
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
        msg: 'case sensitivity',
        path: 'https://www.autohotkey.com/docs/Concepts.htm#names',
    },
    504: {
        msg: 'Note: The "variadic" parameter can only appear at the end of the formal parameter list.',
        path: 'https://www.autohotkey.com/docs/Functions.htm#Variadic',
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
    code601 = 601, // 601 is Prototype pollution!
    code700 = 700, // 700 is Command -> func
    // code701 = 701, // 701~799 is Command error
    // 800~899 is Deprecated / Old Syntax
    code801 = 801,
    code802 = 802,
    code803 = 803,
    code804 = 804,
    code806 = 806,
    code811 = 811,
    code812 = 812,
    code813 = 813,
    code814 = 814,
    code815 = 815,
    code816 = 816,
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
    601: {
        msg: 'Alert Prototype Pollution!! Suggest to use class replace',
        path: 'https://www.autohotkey.com/docs/Objects.htm#Custom_Classes',
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
    806: {
        msg: 'Use `If (expression)` instead.',
        path: 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
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
