import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getFnMetaList } from '../tools/DeepAnalysis/getFnMetaList';
import { TDAMeta, TTextMeta } from '../tools/DeepAnalysis/TypeFnMeta';

type TElement = {
    k: string;
    v: number;
};

type TAnalysisResults = {
    paramMapSize: number;
    valMapSize: number;
    textMapSize: number;
    topFuncNum: number;
};

function AnalysisResults(need: TDAMeta[]): TAnalysisResults {
    let paramMapSize = 0;
    let valMapSize = 0;
    let textMapSize = 0;
    const DEB: Map<string, number> = new Map();
    need.forEach((ed: TDAMeta): void => {
        paramMapSize += ed.paramMap.size;
        valMapSize += ed.valMap.size;
        textMapSize += ed.textMap.size;
        ed.textMap.forEach((v: TTextMeta, k: string): void => {
            const oldNum: number = DEB.get(k) ?? 0;
            DEB.set(k, oldNum + v.refRangeList.length);
        });
    });

    const e5: TElement[] = [];
    for (const [k, v] of DEB) {
        // eslint-disable-next-line no-magic-numbers
        if (v > 10) {
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
        paramMapSize,
        valMapSize,
        textMapSize,
        topFuncNum: need.length,
    };
}

function showOutputChannel(results: TAnalysisResults, timeSpend: number): void {
    const {
        paramMapSize,
        valMapSize,
        textMapSize,
        topFuncNum,
    } = results;

    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${topFuncNum} Symbol`);
    OutputChannel.appendLine(`paramMapSize is ${paramMapSize}`);
    OutputChannel.appendLine(`valMapSize is ${valMapSize}`);
    OutputChannel.appendLine(`textMapSize is ${textMapSize}`);
    OutputChannel.appendLine(`All Size is ${paramMapSize + valMapSize + textMapSize}`);
    OutputChannel.appendLine(`Done in ${timeSpend} ms`);
    OutputChannel.show();
}

export function DeepAnalysisAllFiles(): null {
    const t1: number = Date.now();
    const allFsPath: string[] = Detecter.getDocMapFile();

    const need: TDAMeta[] = [];
    allFsPath.forEach((fsPath: string): void => {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) return;

        const { AhkSymbolList, DocStrMap } = AhkFileData;
        const uri: vscode.Uri = vscode.Uri.file(fsPath);

        need.push(...getFnMetaList(AhkSymbolList, DocStrMap));

        digDAFile(AhkSymbolList, DocStrMap, uri);
    });

    const t2 = Date.now();
    showOutputChannel(AnalysisResults(need), t2 - t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 828 Symbol <--keep 828!
paramMapSize is 2273 <--keep 2273!
valMapSize is 2095
textMapSize is 573 <- next plan: ignore keyWord.
All Size is 4941
Done in 8 ms
*/
