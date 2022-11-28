import { ECommandOption, getCommandOptions } from '../../configUI';
import { enumLog } from '../enumErr';
import { getAllFunc } from '../Func/getAllFunc';
import type { TSnippetCommand } from './Command_tools';
import { snippetCommand } from './Command_tools';
import type { CSnippetCommand } from './CSnippetCommand';

const snippetCommandFilter: readonly CSnippetCommand[] = snippetCommand.filter((v) => v.recommended);

export function getSnippetCommand(subStr: string): TSnippetCommand {
    // ^ ~~ $  need close
    const isOK: boolean = (/^\w*$/u).test(subStr)
        || (/^case\s[^:]+:\s*\w*$/iu).test(subStr)
        || (/^default\s*:\s*\w*$/iu).test(subStr)
        || (/::\s*\w*$/iu).test(subStr); // allow hotstring or hotkey

    // || (/^[{}]\s*\w*$/iu).test(subStr);
    // { MsgBox hi!
    // ^---- "{" and cmd
    // i know this is OK, but i don't want to Completion the case...

    if (!isOK) return [];

    //
    const opt: ECommandOption = getCommandOptions();

    switch (opt) {
        case ECommandOption.All:
            return snippetCommand;

        case ECommandOption.Recommended:
            return snippetCommandFilter;

        case ECommandOption.noSameFunc: {
            const fnMap = getAllFunc();
            return snippetCommandFilter.filter((v) => !fnMap.has(v.upName));
        }

        case ECommandOption.notProvided:
            return [];

        default:
            enumLog(opt);
            return [];
    }
}
