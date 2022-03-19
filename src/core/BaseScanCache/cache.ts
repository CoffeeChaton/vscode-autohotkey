/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/member-ordering */
import * as vscode from 'vscode';
import {
    TAhkSymbolList,
    TGlobalVal,
    TGValMap,
    TTokenStream,
    TValUpName,
} from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';
import { hashCode } from '../../tools/str/hashCode';
import { getChildren } from '../getChildren';
import { getReturnByLine, ParserBlock } from '../Parser';
import { ParserLine } from '../ParserTools/ParserLine';

type TFsPath = string; // vscode.uru.fsPath
type TCache = {
    hash: number;
    AhkSymbolList: TAhkSymbolList;
    gValMapBySelf: TGValMap;
    DocStrMap: TTokenStream;
};

function cacheFix(fsPath: string, cache: Map<TFsPath, TCache[]>): void {
    // if (cache.size > 5) {
    //     cache.clear();
    // }

    cache.forEach((value: TCache[], key: string): void => {
        if (value.length === 1 || key === fsPath) {
            return;
        }
        const tempVal = value.pop(); // last
        if (tempVal) {
            // eslint-disable-next-line no-param-reassign
            value.length = 0;
            value.push(tempVal);
        }
    });
}

export const BaseScanCache = {
    cache: new Map<TFsPath, TCache[]>(),

    cacheSizeAutoFix(fsPath: TFsPath): TCache[] {
        const oldCache: TCache[] | undefined = this.cache.get(fsPath);

        cacheFix(fsPath, this.cache);

        if (oldCache === undefined) return [];

        return oldCache.length > 20
            ? oldCache.slice(-10)
            : oldCache;
    },

    setCache(fsPath: TFsPath, AhkCache: TCache): void {
        if (!fsPath.endsWith('.ahk')) return;

        const oldCache: TCache[] = this.cacheSizeAutoFix(fsPath);
        oldCache.push(AhkCache);
        this.cache.set(fsPath, oldCache);
    },

    getCache(fsPath: TFsPath, hash: number): TCache | undefined {
        return this.cache
            .get(fsPath)
            ?.find((v: TCache): boolean => v.hash === hash);
    },

    clear(): void {
        this.cache.clear();
    },
} as const;

// vscode.window.activeTextEditor
// vscode.window.visibleTextEditors

export function getBaseData(document: vscode.TextDocument): TCache {
    const fullText: string = document.getText().replaceAll(/\r/gu, '');
    const hash: number = hashCode(fullText);
    const { fsPath } = document.uri;
    const oldCache: TCache | undefined = BaseScanCache.getCache(fsPath, hash);
    if (oldCache !== undefined) return oldCache;

    const gValMapBySelf: TGValMap = new Map<TValUpName, TGlobalVal[]>();
    const DocStrMap: TTokenStream = Pretreatment(fullText.split('\n'), 0);
    const AhkSymbolList: TAhkSymbolList = getChildren({
        gValMapBySelf,
        DocStrMap,
        RangeStartLine: 0,
        RangeEndLine: DocStrMap.length,
        inClass: false,
        fnList: [
            ParserBlock.getClass,
            ParserBlock.getFunc,
            ParserBlock.getComment,
            ParserBlock.getSwitchBlock,
            getReturnByLine,
            ParserLine,
        ],
    });

    const AhkCache: TCache = {
        hash,
        gValMapBySelf,
        DocStrMap,
        AhkSymbolList,
    };
    BaseScanCache.setCache(fsPath, AhkCache);
    return AhkCache;
}
