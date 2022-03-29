/* eslint-disable max-statements */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { diagColl } from '../core/diagRoot';
import { EDiagBase, TAhkSymbolList, TDeepAnalysisMeta } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';
import { diagDAFile } from '../tools/DeepAnalysis/Diag/diagDA';

function showOutputChannel(need: TDeepAnalysisMeta[], timeSpend: number): void {
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

    type TElement = {
        k: string;
        v: number;
    };
    const e5: TElement[] = [];
    for (const [k, v] of DEB) {
        // eslint-disable-next-line no-magic-numbers
        if (v > 20) {
            e5.push({ k, v });
        }
    }
    DEB.clear();
    e5.sort((a: TElement, b: TElement): number => b.v - a.v);

    OutputChannel.clear();
    OutputChannel.appendLine('Deep Analysis All Files');
    OutputChannel.appendLine(`Deep Analysis : ${need.length} Symbol`);
    OutputChannel.appendLine(`argMapSize is ${argMapSize}`);
    OutputChannel.appendLine(`valMapSize is ${valMapSize}`);
    OutputChannel.appendLine(`textMapSize is ${textMapSize}`);
    OutputChannel.appendLine(`All Size is ${argMapSize + valMapSize + textMapSize}`);
    OutputChannel.appendLine(`Done in ${timeSpend} ms`);
    OutputChannel.appendLine('------>>>------Word frequency statistics----->>>----->>>');
    for (const { k, v } of e5) { //
        OutputChannel.appendLine(`${k}: ${v}`);
    }
    e5.length = 0; //
    OutputChannel.show();
}

export async function DeepAnalysisAllFiles(): Promise<null> {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile(); // FIX

    const need: TDeepAnalysisMeta[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;

        const Uri = vscode.Uri.file(fsPath);
        // eslint-disable-next-line no-await-in-loop
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(Uri);
        for (const ahkSymbol of AhkSymbolList) {
            const DA: TDeepAnalysisMeta | null = DeepAnalysis(document, ahkSymbol);
            if (DA !== null) need.push(DA);
        }
        const diagnostics = diagDAFile(AhkSymbolList, document);
        const baseDiag = (diagColl.get(Uri) || []).filter((v) => v.source !== EDiagBase.sourceDA);
        diagColl.set(Uri, [
            ...baseDiag,
            ...diagnostics,
        ]);
    }

    const t2 = Date.now();
    showOutputChannel(need, t2 - t1);

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
