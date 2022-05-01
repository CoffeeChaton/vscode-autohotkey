import { CAhkFunc } from '../../CAhkFunc';
import { TTokenStream } from '../../globalEnum';
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

function splitLine(keyUp: string, fullFuncMap: TFullFuncMap): string {
    const DA: CAhkFunc | undefined = fullFuncMap.get(keyUp);
    return DA === undefined
        ? `${keyUp} ; "Command"`
        : `${DA.name}(...) vs "Command" ${keyUp} ; `;
}

export function AnalyzeCommand(AhkTokenList: TTokenStream, fullFuncMap: TFullFuncMap): string[] {
    const commandMap: TCommandInfoMap = getCommandMap(AhkTokenList);

    if (commandMap.size === 0) return [];

    const ed: string[] = [
        '/**',
        '* @Analyze Command',
        '*   Commands vs Functions -> https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
        '*   if you what to user function replace command, you can use Functions.ahk',
        '*   Functions.ahk -> https://www.autohotkey.com/docs/Functions.htm#Other_Functions',
        '*/',
        'loop, 0 {',
    ];

    for (const [keyUp, MsgList] of commandMap) {
        ed.push(
            splitLine(keyUp, fullFuncMap),
            ...MsgList.map((Msg: TMsg): string => `; ln ${Msg.line + 1} ;    ${Msg.textRaw.trim()}`),
            '',
        );
    }

    ed.pop();
    ed.push('}');
    ed.push('');
    return ed;
}
