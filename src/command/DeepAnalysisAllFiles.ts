import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../core/Detecter';
import { CAhkFuncSymbol } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../tools/DeepAnalysis/getDAList';
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

    const need: CAhkFuncSymbol[] = [];
    allFsPath.forEach((fsPath: string): void => {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) return;

        const { AhkSymbolList } = AhkFileData;

        const DAList: CAhkFuncSymbol[] = getDAList(AhkSymbolList);

        need.push(...DAList);
        digDAFile(DAList, vscode.Uri.file(fsPath));
    });

    const t2 = Date.now();
    showOutputChannel(WordFrequencyStatistics(need), t2 - t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 859 Symbol <--keep 859!
paramMapSize is 2320 <--keep 2320!
valMapSize is 2162
textMapSize is 625 <- next plan: ignore keyWord.
All Size is 5106
Done in 5 ms
*/
