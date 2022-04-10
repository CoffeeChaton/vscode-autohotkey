import * as vscode from 'vscode';
import { msgWithPos } from '../../command/ListAllFunc';
import { EMode, TFsPath, TTokenStream } from '../../globalEnum';
import { getDAWithName } from '../../tools/DeepAnalysis/getDAWithName';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { OutputChannel as out } from '../vscWindows/OutputChannel';

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

function printCommandList(fsPath: string, MsgList: TMsg[]): void {
    for (const Msg of MsgList) {
        const text1 = `    ${Msg.textRaw.trim()}`;
        const startPos: vscode.Position = new vscode.Position(Msg.line, 0);
        out.appendLine(msgWithPos(text1, fsPath, startPos));
    }
}

function splitLine(keyUp: string): void {
    const DA: TDAMeta | null = getDAWithName(keyUp, EMode.ahkFunc);
    if (DA === null) {
        out.appendLine(`"${keyUp}"`);
    } else {
        const funcSplitLine = `${DA.funcRawName}(...) vs Command "${keyUp}" `;
        out.appendLine(msgWithPos(funcSplitLine, DA.uri.fsPath, DA.range.start));
    }
}

export function commandAnalyze(AhkTokenList: TTokenStream, fsPath: TFsPath): void {
    const commandMap: TCommandInfoMap = getCommandMap(AhkTokenList);

    if (commandMap.size === 0) return;

    out.appendLine('"--- command Analyze Start ---"');
    out.appendLine('');
    for (const [keyUp, MsgList] of commandMap) {
        splitLine(keyUp);
        printCommandList(fsPath, MsgList);
        out.appendLine('');
    }

    out.appendLine('; if you what to user function replace command, you can use this.');
    out.appendLine('; https://www.autohotkey.com/docs/Functions.htm#Other_Functions');
    out.appendLine('"--- command Analyze End ---"');
}
