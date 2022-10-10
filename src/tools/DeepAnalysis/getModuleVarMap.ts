import * as path from 'node:path';
import type * as vscode from 'vscode';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type {
    TParamMapIn,
    TTextMapIn,
    TTextMapOut,
    TValMapIn,
    TValMapOut,
    TValMetaIn,
} from '../../AhkSymbol/CAhkFunc';
import {
    CAhkFunc,
} from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { wrapFnValDef } from './FnVar/def/wrapFnValDef';
import { EFnMode } from './FnVar/EFnMode';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';

export type TModuleVar = {
    readonly ModuleValMap: TValMapOut;
    readonly ModuleTextMap: TTextMapOut;
    readonly allowList: readonly boolean[];
};

function getModuleAllowList(DocStrMap: TTokenStream, AST: TAstRoot): readonly boolean[] {
    const rangeList: readonly vscode.Range[] = AST
        .filter((TopSymbol: TTopSymbol): boolean => TopSymbol instanceof CAhkFunc || TopSymbol instanceof CAhkClass)
        .map((TopSymbol: TTopSymbol): vscode.Range => TopSymbol.range);

    if (rangeList.length === 0) {
        return DocStrMap.map(() => true);
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
    const nullMap = new Map();

    const allowList: readonly boolean[] = getModuleAllowList(DocStrMap, AST);
    const ModuleValMap: TValMapIn = getFnVarDef(allowList, AhkTokenList, paramMap, nullMap, EFnMode.global);
    const ModuleTextMap: TTextMapIn = getUnknownTextMap(allowList, AhkTokenList, paramMap, ModuleValMap, GValMap, name);

    for (const [upName, GlobalVal] of GValMap) {
        const { defRangeList, refRangeList } = GlobalVal;
        for (const { rawName, range } of [...defRangeList, ...refRangeList]) {
            const value: TValMetaIn = wrapFnValDef({
                RawNameNew: rawName,
                valMap: ModuleValMap,
                defRange: range,
                lineComment: '',
                fnMode: EFnMode.global,
            });
            ModuleValMap.set(upName, value);
        }
    }

    return {
        ModuleValMap,
        ModuleTextMap,
        allowList,
    };
}
