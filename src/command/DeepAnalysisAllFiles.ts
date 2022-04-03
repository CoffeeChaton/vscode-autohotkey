import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../core/Detecter';
import { diagColl } from '../core/diagRoot';
import { EDiagBase } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { diagDAFile } from '../tools/DeepAnalysis/Diag/diagDA';
import { getFnMetaList } from '../tools/DeepAnalysis/getFnMetaList';
import { TDeepAnalysisMeta } from '../tools/DeepAnalysis/TypeFnMeta';

type TElement = {
    k: string;
    v: number;
};

type TAnalysisResults = {
    argMapSize: number;
    valMapSize: number;
    textMapSize: number;
    topFuncNum: number; // Deep Analysis : ${need.length} Symbol // 809
};

function AnalysisResults(need: TDeepAnalysisMeta[]): TAnalysisResults {
    const topFuncNum = need.length;
    let argMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    const DEB = new Map<string, number>();
    need.forEach((ed) => {
        argMapSize += ed.argMap.size;
        valMapSize += ed.valMap.size;
        textMapSize += ed.textMap.size;
        ed.textMap.forEach((v, k) => {
            const oldNum = DEB.get(k) ?? 0;
            DEB.set(k, oldNum + v.refRangeList.length);
        });
    });

    const e5: TElement[] = [];
    for (const [k, v] of DEB) {
        // eslint-disable-next-line no-magic-numbers
        if (v > 20) {
            e5.push({ k, v });
        }
    }
    e5.sort((a: TElement, b: TElement): number => b.v - a.v);
    OutputChannel.clear();
    OutputChannel.appendLine('------>>>------this package: unknown Word frequency statistics----->>>-----');
    for (const { k, v } of e5) { //
        OutputChannel.appendLine(`${k}: ${v}`); // TODO: remove global variables of this file / func
    }
    OutputChannel.appendLine('------<<<------this package: unknown Word frequency statistics-----<<<-----');

    return {
        argMapSize,
        valMapSize,
        textMapSize,
        topFuncNum,
    };
}

function showOutputChannel(results: TAnalysisResults, timeSpend: number): void {
    const {
        argMapSize,
        valMapSize,
        textMapSize,
        topFuncNum,
    } = results;

    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${topFuncNum} Symbol`);
    OutputChannel.appendLine(`argMapSize is ${argMapSize}`);
    OutputChannel.appendLine(`valMapSize is ${valMapSize}`);
    OutputChannel.appendLine(`textMapSize is ${textMapSize}`);
    OutputChannel.appendLine(`All Size is ${argMapSize + valMapSize + textMapSize}`);
    OutputChannel.appendLine(`Done in ${timeSpend} ms`);
    OutputChannel.show();
}

export function DeepAnalysisAllFiles(): null {
    const t1: number = Date.now();
    const allFsPath: string[] = Detecter.getDocMapFile();

    const need: TDeepAnalysisMeta[] = [];
    allFsPath.forEach((fsPath: string): void => {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) return;

        const { AhkSymbolList, DocStrMap } = AhkFileData;
        const uri: vscode.Uri = vscode.Uri.file(fsPath);

        const DAList: TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
        need.push(...DAList);

        const baseDiag: vscode.Diagnostic[] = (diagColl.get(uri) || [])
            .filter((diag: vscode.Diagnostic): boolean => diag.source !== EDiagBase.sourceDA);
        diagColl.set(uri, [...baseDiag, ...diagDAFile(DAList)]);
    });

    const t2 = Date.now();
    showOutputChannel(AnalysisResults(need), t2 - t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 809 Symbol <--keep 809!
argMapSize is 2231 <--keep 2231!
valMapSize is 2055
textMapSize is 1067 <- next plan: ignore keyWord.
All Size is 5353
Done in 411 ms
*/
