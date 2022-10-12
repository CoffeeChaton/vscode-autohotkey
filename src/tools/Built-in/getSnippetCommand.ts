import type * as vscode from 'vscode';
import { ECommandOption, getCommandOptions } from '../../configUI';
import { enumLog } from '../enumErr';
import { getAllFunc } from '../Func/getAllFunc';
import type { TSnippetCommand } from './Command_tools';
import { snippetCommand } from './Command_tools';
import type { CSnippetCommand } from './CSnippetCommand';

const snippetCommandFilter: readonly CSnippetCommand[] = snippetCommand.filter((v) => v.recommended);

export function getSnippetCommand(lStr: string, position: vscode.Position): TSnippetCommand {
    const subStr: string = lStr.slice(0, position.character).trim();

    const isOK: boolean = (/^\w*$/u).test(subStr)
        || (/^case\s[^:]+:/iu).test(subStr)
        || (/^default\s*:/iu).test(subStr)
        || (/::\s*\w*$/iu).test(subStr); // allow hotstring or hotkey

    if (!isOK) return [];

    //
    const opt: ECommandOption = getCommandOptions();

    if (opt === ECommandOption.noSameFunc) {
        const fnMap = getAllFunc();
        return snippetCommandFilter.filter((v) => !fnMap.has(v.upName));
    }

    switch (opt) {
        case ECommandOption.All:
            return snippetCommand;

        case ECommandOption.Recommended:
            return snippetCommandFilter;

        case ECommandOption.notProvided:
            return [];

        default:
            enumLog(opt);
            return [];
    }
}
