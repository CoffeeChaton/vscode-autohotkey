import * as vscode from 'vscode';
import { CAhkFunc } from '../CAhkFunc';
import { Detecter, TAhkFileData } from '../core/Detecter';
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

    const need: CAhkFunc[] = [];
    allFsPath.forEach((fsPath: string): void => {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) return;

        const { AhkSymbolList } = AhkFileData;

        const DAList: CAhkFunc[] = getDAList(AhkSymbolList);

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
Deep Analysis : 706 Symbol <--keep 708!
paramMapSize is 1871 <--keep 1871!
valMapSize is 1859
textMapSize is 438 <- next plan: ignore keyWord.
All Size is 4168
Done in 3 ms
*/
