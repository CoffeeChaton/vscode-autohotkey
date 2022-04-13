import { TTokenStream } from '../../globalEnum';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { TFullFuncMap } from '../../tools/Func/getAllFunc';

function getIgnoreList(): string[] {
    return [
        'IF',
        'ELSE',
        'RETURN',

        'STATIC',
        'LOCAL',
        'GLOBAL',

        'SWITCH',
        'CASE',
        'DEFAULT',

        'TRUE',
        'FALSE',

        'FOR',
        'LOOP',
        'WHILE',
        'BREAK',
        'CONTINUE',

        'AND',
        'OR',
        'IN',
        'NOT',

        // 'CLASS',
        'NEW',
    ];
}

type TMsg = {
    line: number;
    textRaw: string;
};
//                      keyUp       line
type TCommandInfoMap = Map<string, TMsg[]>;

function getCommandMap(AhkTokenList: TTokenStream): TCommandInfoMap {
    const commandMap: TCommandInfoMap = new Map();
    for (const { fistWordUp, line, textRaw } of AhkTokenList) {
        if (fistWordUp === '') continue;
        const msg: TMsg[] = commandMap.get(fistWordUp) ?? [];
        msg.push({
            line,
            textRaw,
        });
        commandMap.set(fistWordUp, msg);
    }

    const ignoreList: string[] = getIgnoreList();
    for (const key of ignoreList) {
        commandMap.delete(key);
    }
    return commandMap;
}

function printCommandList(MsgList: TMsg[], ed: string[]): void {
    for (const Msg of MsgList) {
        ed.push(`    ${Msg.textRaw.trim()} ; line ${Msg.line}`);
    }
}

function splitLine(keyUp: string, fullFuncMap: TFullFuncMap, ed: string[]): void {
    const DA: TDAMeta | undefined = fullFuncMap.get(keyUp);
    if (DA === undefined) {
        ed.push(`${keyUp} ; "Command"`);
    } else {
        ed.push(`${DA.funcRawName}(...) vs "Command" ${keyUp} ; `);
    }
}

export function commandAnalyze(AhkTokenList: TTokenStream, fullFuncMap: TFullFuncMap): string[] {
    const commandMap: TCommandInfoMap = getCommandMap(AhkTokenList);

    if (commandMap.size === 0) return [];

    const ed: string[] = [
        '/**',
        '* @Analyze of command',
        '* ',
        '* Commands vs Functions -> https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
        '* if you what to user function replace command, you can use Functions.ahk',
        '* Functions.ahk -> https://www.autohotkey.com/docs/Functions.htm#Other_Functions',
        '* ',
        '*/',
    ];

    for (const [keyUp, MsgList] of commandMap) {
        splitLine(keyUp, fullFuncMap, ed);
        printCommandList(MsgList, ed);
        ed.push('');
    }

    return ed;
}
