import * as path from 'node:path';
import type * as vscode from 'vscode';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type {
    TParamMapIn,
    TTextMapIn,
    TTextMapOut,
    TValMapIn,
    TValMapOut,
} from '../../AhkSymbol/CAhkFunc';
import {
    CAhkFunc,
} from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';

export type TModuleVar = {
    readonly ModuleValMap: TValMapOut;
    readonly ModuleTextMap: TTextMapOut;
};

function getModuleAllowList(DocStrMap: TTokenStream, AST: TAstRoot): readonly boolean[] {
    const rangeList: vscode.Range[] = [];
    for (const AhkSymbol of AST) {
        if (AhkSymbol instanceof CAhkFunc) {
            rangeList.push(AhkSymbol.range);
        } else if (AhkSymbol instanceof CAhkClass) {
            rangeList.push(AhkSymbol.range);
        }
    }

    if (rangeList.length === 0) {
        const len = DocStrMap.length;
        const arr: true[] = [];
        for (let index = 0; index < len; index++) {
            arr.push(true); // i don't why ts think ->  Array.from().fill(true) is unknown[]...
        }
        return arr;
    }

    let i = 0; // refer to rangeList i
    const allowList: boolean[] = [];
    for (const { line } of DocStrMap) {
        if (line < rangeList[i].start.line) {
            allowList.push(true);
        } else if (line >= rangeList[i].start.line && line <= rangeList[i].end.line) {
            allowList.push(false);
        } else if (line > rangeList[i].end.line) {
            allowList.push(true);
            if ((i + 1) < rangeList.length) {
                i++;
            } // TODO ...clear this
        }
    }

    return allowList;
}

export function getModuleVarMap(
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    AST: TAstRoot,
    fsPath: string,
): TModuleVar {
    const AhkTokenList: TTokenStream = DocStrMap;
    const paramMap: TParamMapIn = new Map();
    const name: string = path.basename(fsPath);

    const allowList: readonly boolean[] = getModuleAllowList(DocStrMap, AST);
    const ModuleValMap: TValMapIn = getFnVarDef(allowList, AhkTokenList, paramMap, GValMap);
    const ModuleTextMap: TTextMapIn = getUnknownTextMap(allowList, AhkTokenList, paramMap, ModuleValMap, GValMap, name);

    return {
        ModuleValMap,
        ModuleTextMap,
    };
}
