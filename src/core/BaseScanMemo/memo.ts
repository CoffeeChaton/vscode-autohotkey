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
import { baseDiagnostic } from '../../provider/Diagnostic/Diagnostic';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { Pretreatment } from '../../tools/Pretreatment';
import { hashCode } from '../../tools/str/hashCode';
import { getChildren } from '../getChildren';
import { ParserBlock } from '../Parser';
import { ParserLine } from '../ParserTools/ParserLine';

type TFsPath = string; // vscode.uru.fsPath
type TMemo = {
    hash: number;
    AhkSymbolList: TAhkSymbolList;
    GValMap: TGValMap;
    DocStrMap: TTokenStream;
    baseDiag: vscode.Diagnostic[];
    DAList: TDAMeta[];
};

export const BaseScanMemo = {
    memo: new Map<TFsPath, TMemo[]>(),

    memoSizeFix(fsPath: TFsPath): TMemo[] {
        const oldCache: TMemo[] | undefined = this.memo.get(fsPath);

        for (const [key, value] of this.memo) {
            if (value.length < 2 || key === fsPath) {
                continue;
            }
            const tempVal: TMemo | undefined = value[value.length - 1]; // last
            if (tempVal !== undefined) {
                value.length = 0;
                value.push(tempVal);
            }
        }

        if (oldCache === undefined) return [];

        return oldCache.length > 20
            ? oldCache.slice(-10)
            : oldCache;
    },

    setMemo(fsPath: TFsPath, AhkCache: TMemo): void {
        if (!fsPath.endsWith('.ahk')) return;

        const oldCache: TMemo[] = this.memoSizeFix(fsPath);
        oldCache.push(AhkCache);
        this.memo.set(fsPath, oldCache);
    },

    getMemo(fsPath: TFsPath, hash: number): TMemo | undefined {
        return this.memo
            .get(fsPath)
            ?.find((v: TMemo): boolean => v.hash === hash);
    },

    clear(): void {
        this.memo.clear();
    },
} as const;

// vscode.window.activeTextEditor
// vscode.window.visibleTextEditors

export function getBaseData(document: vscode.TextDocument): TMemo {
    const fullText: string = document.getText().replaceAll(/\r/gu, '');
    const hash: number = hashCode(fullText);
    const { fsPath } = document.uri;
    const oldCache: TMemo | undefined = BaseScanMemo.getMemo(fsPath, hash);
    if (oldCache !== undefined) return oldCache;

    const DocStrMap: TTokenStream = Pretreatment(fullText.split('\n'), 0);
    const GValMap: TGValMap = new Map<TValUpName, TGlobalVal>();

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
        GValMap,
    });

    const baseDiag: vscode.Diagnostic[] = baseDiagnostic(DocStrMap, AhkSymbolList);
    const DAList: TDAMeta[] = DeepAnalysis(AhkSymbolList, DocStrMap, GValMap);
    const AhkCache: TMemo = {
        hash,
        GValMap,
        DocStrMap,
        AhkSymbolList,
        baseDiag,
        DAList,
    };
    BaseScanMemo.setMemo(fsPath, AhkCache);
    return AhkCache;
}
