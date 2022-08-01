/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TFsPath, TTokenStream } from '../../globalEnum';
import { baseDiagnostic } from '../../provider/Diagnostic/Diagnostic';
import { getChildren } from '../getChildren';
import { getClass } from '../getClass';
import { ParserBlock } from '../Parser';
import { getFunc } from '../ParserFunc';
import type { TGValMap, TGValMapReadOnly } from '../ParserTools/ahkGlobalDef';
import { ahkGlobalMain } from '../ParserTools/ahkGlobalDef';
import { ParserLine } from '../ParserTools/ParserLine';
import { Pretreatment } from '../Pretreatment';

/**
 * Never user this, just for Memo...
 */
class CTopClass extends vscode.DocumentSymbol {
    declare public readonly children: TTopSymbol[];
}

export type TMemo = Readonly<{
    readonly AhkSymbolList: readonly TTopSymbol[];
    readonly GValMap: TGValMapReadOnly;
    readonly DocStrMap: TTokenStream;
    readonly DocFullSize: number;
    readonly baseDiag: readonly vscode.Diagnostic[];
    readonly uri: vscode.Uri;
}>;

function strListDeepEq(DocStrMap: TTokenStream, fullTextList: readonly string[]): boolean {
    const len: number = DocStrMap.length;
    if (len !== fullTextList.length) return false;
    for (let i = 0; i < len; i++) {
        if (fullTextList[i].length !== DocStrMap[i].textRaw.length) return false;
        if (fullTextList[i] !== DocStrMap[i].textRaw) return false;
    }
    return true;
}

export const BaseScanMemo = {
    memo: new Map<TFsPath, TMemo[]>(),

    memoSizeFix(fsPath: TFsPath): TMemo[] {
        const oldCache: TMemo[] | undefined = this.memo.get(fsPath);

        for (const [key, value] of this.memo) {
            if (key === fsPath) continue;

            const tempVal: TMemo | undefined = value.at(-1); // last
            if (tempVal !== undefined) {
                value.length = 0;
                value.push(tempVal);
            }
        }

        if (oldCache === undefined) return [];

        return oldCache.length > 10
            ? oldCache.slice(-5)
            : oldCache;
    },

    setMemo(fsPath: TFsPath, AhkCache: TMemo): void {
        if (!fsPath.endsWith('.ahk')) return;

        const oldCache: TMemo[] = this.memoSizeFix(fsPath);
        oldCache.push(AhkCache);
        this.memo.set(fsPath, oldCache);
    },

    getMemo(fsPath: TFsPath, fullTextList: readonly string[], DocFullSize: number): TMemo | undefined {
        return this.memo
            .get(fsPath)
            ?.find((v: TMemo): boolean => v.DocFullSize === DocFullSize && strListDeepEq(v.DocStrMap, fullTextList));
    },

    clear(): void {
        this.memo.clear();
    },
} as const;

export function getBaseData(document: vscode.TextDocument): TMemo {
    const fullText: string = document.getText();
    const fullTextList: readonly string[] = fullText.split(/\r?\n/u);
    const DocFullSize: number = fullText.length;
    const { fsPath } = document.uri;
    const oldCache: TMemo | undefined = BaseScanMemo.getMemo(fsPath, fullTextList, DocFullSize);
    if (oldCache !== undefined) return oldCache;

    const DocStrMap: TTokenStream = Pretreatment(fullTextList, document.fileName);
    const GValMap: TGValMap = ahkGlobalMain(DocStrMap);
    const AhkSymbolList: TTopSymbol[] = getChildren<CTopClass>(
        [getClass, getFunc, ParserBlock.getSwitchBlock, ParserLine],
        {
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            defStack: [],
            document,
            GValMap,
        },
    );

    const baseDiag: readonly vscode.Diagnostic[] = baseDiagnostic(DocStrMap, AhkSymbolList);

    const AhkCache: TMemo = {
        GValMap, // TGValMapReadOnly
        DocStrMap,
        AhkSymbolList,
        baseDiag,
        DocFullSize,
        uri: document.uri,
    };
    BaseScanMemo.setMemo(fsPath, AhkCache);
    return AhkCache;
}

// /**
//  * vscode.Tab
//  * number
//  */
// const activityMap: Map<vscode.Tab, number> = new Map();
//
// export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
//     for (const removedTab of tabChangeEvent.closed) {
//         activityMap.delete(removedTab);
//     }
//
//     const changedTabs = [...tabChangeEvent.opened, ...tabChangeEvent.changed];
//
//     for (const tab of changedTabs) {
//         activityMap.set(tab, Date.now());
//     }
// }

// export function onDidChangeTabGroups(e: vscode.TabGroupChangeEvent): void {
//     const tabList: vscode.Tab[] = vscode.window.tabGroups.all
//         .flatMap((group: vscode.TabGroup): readonly vscode.Tab[] => group.tabs);
//
//     activityMap.clear();
//     for (const tab of tabList) {
//         activityMap.set(tab, Date.now());
//     }
// }
