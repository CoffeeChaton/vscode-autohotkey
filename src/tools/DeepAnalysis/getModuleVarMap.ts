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
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../globalEnum';
import { wrapFnValDef } from './FnVar/def/wrapFnValDef';
import { EFnMode } from './FnVar/EFnMode';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getDAList } from './getDAList';
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

function moveGValMap2ModuleMap(GValMap: TGValMap, ModuleValMap: TValMapIn): void {
    for (const [upName, { defRangeList, refRangeList }] of GValMap) {
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
}

function moveTextMap2ModuleMap(AST: TAstRoot, valMap: TValMapIn): void {
    const DAList: CAhkFunc[] = getDAList(AST);
    for (const vv of DAList) {
        const textMapRW: TTextMapIn = vv.textMap as TTextMapIn; // eval
        if (vv.fnMode === EFnMode.forceLocal) continue;
        for (const [k, v] of textMapRW) {
            const oldVal: TValMetaIn | undefined = valMap.get(k);
            if (oldVal === undefined) continue;
            oldVal.refRangeList.push(...v.refRangeList);
            textMapRW.delete(k);
        }
    }
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
    const { valMap } = getFnVarDef(allowList, AhkTokenList, paramMap, nullMap, EFnMode.global);
    const ModuleTextMap: TTextMapIn = getUnknownTextMap(allowList, AhkTokenList, paramMap, valMap, GValMap, name);

    moveGValMap2ModuleMap(GValMap, valMap);
    moveTextMap2ModuleMap(AST, valMap);

    return {
        ModuleValMap: valMap,
        ModuleTextMap,
        allowList,
    };
}
