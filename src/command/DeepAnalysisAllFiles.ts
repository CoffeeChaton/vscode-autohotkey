import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getFnMetaList } from '../tools/DeepAnalysis/getFnMetaList';
import { TDAMeta } from '../tools/DeepAnalysis/TypeFnMeta';
import { TWordFrequencyStatistics, WordFrequencyStatistics } from './tools/WordFrequencyStatistics';

function showOutputChannel(results: TWordFrequencyStatistics, timeSpend: number): void {
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
    showOutputChannel(WordFrequencyStatistics(need), t2 - t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 828 Symbol <--keep 828!
paramMapSize is 2273 <--keep 2273!
valMapSize is 2095
textMapSize is 568 <- next plan: ignore keyWord.
All Size is 4936
Done in 8 ms
*/
