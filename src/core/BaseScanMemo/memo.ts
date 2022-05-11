/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { TFsPath, TTokenStream } from '../../globalEnum';
import { baseDiagnostic } from '../../provider/Diagnostic/Diagnostic';
import { getChildren } from '../getChildren';
import { getClass, getFunc, ParserBlock } from '../Parser';
import { ahkGlobalMain, TGValMap, TGValMapReadOnly } from '../ParserTools/ahkGlobalDef';
import { ParserLine } from '../ParserTools/ParserLine';
import { Pretreatment } from '../Pretreatment';

/**
 * Never user this, just for Memo...
 */
class CTopClass extends vscode.DocumentSymbol {
    declare public readonly children: TTopSymbol[];
}

export type TMemo = {
    AhkSymbolList: TTopSymbol[];
    GValMap: TGValMapReadOnly;
    DocStrMap: TTokenStream;
    DocFullSize: number;
    baseDiag: vscode.Diagnostic[];
};

function strListDeepEq(DocStrMap: TTokenStream, fullTextList: string[]): boolean {
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
            if (value.length <= 1 || key === fsPath) {
                continue;
            }
            const tempVal: TMemo = value[value.length - 1]; // last
            value.length = 0;
            value.push(tempVal);
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

    getMemo(fsPath: TFsPath, fullTextList: string[], DocFullSize: number): TMemo | undefined {
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
    const fullTextList: string[] = fullText
        .replaceAll(/\r/gu, '')
        .split('\n');
    const DocFullSize: number = fullText.length;
    const { fsPath } = document.uri;
    const oldCache: TMemo | undefined = BaseScanMemo.getMemo(fsPath, fullTextList, DocFullSize);
    if (oldCache !== undefined) return oldCache;

    const DocStrMap: TTokenStream = Pretreatment(fullTextList, 0, document.fileName);
    const GValMap: TGValMap = ahkGlobalMain(DocStrMap);
    const AhkSymbolList = getChildren<CTopClass>(
        [getClass, getFunc, ParserBlock.getSwitchBlock, ParserLine],
        {
            DocStrMap,
            RangeStartLine: 0,
            RangeEndLine: DocStrMap.length,
            classStack: [],
            document,
            GValMap,
        },
    );

    const baseDiag: vscode.Diagnostic[] = baseDiagnostic(DocStrMap, AhkSymbolList);
    const AhkCache: TMemo = {
        GValMap, // TGValMapReadOnly
        DocStrMap,
        AhkSymbolList,
        baseDiag,
        DocFullSize,
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
