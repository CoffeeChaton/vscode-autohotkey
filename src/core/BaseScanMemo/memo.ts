/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import {
    TAhkSymbolList,
    TFsPath,
    TTokenStream,
} from '../../globalEnum';
import { baseDiagnostic } from '../../provider/Diagnostic/Diagnostic';
import { Pretreatment } from '../../tools/Pretreatment';
import { getChildren } from '../getChildren';
import { ParserBlock } from '../Parser';
import { ahkGlobalMain, TGValMap, TGValMapReadOnly } from '../ParserTools/ahkGlobalDef';
import { ParserLine } from '../ParserTools/ParserLine';

export type TMemo = {
    AhkSymbolList: TAhkSymbolList;
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
            const tempVal: TMemo | undefined = value[value.length - 1]; // last
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
    const AhkSymbolList: TAhkSymbolList = getChildren({
        DocStrMap,
        RangeStartLine: 0,
        RangeEndLine: DocStrMap.length,
        inClass: false,
        fnList: [
            ParserBlock.getClass,
            ParserBlock.getFunc,
            ParserBlock.getComment,
            ParserBlock.getSwitchBlock,
            ParserLine,
        ],
        document,
        GValMap,
    });

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
