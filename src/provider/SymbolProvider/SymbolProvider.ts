/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { diagColl } from '../../core/diagRoot';
import { EDiagBase } from '../../globalEnum';
import { diagDAFile } from '../../tools/DeepAnalysis/Diag/diagDA';
import { getFnMetaList } from '../../tools/DeepAnalysis/getFnMetaList';
import { TDeepAnalysisMeta } from '../../tools/DeepAnalysis/TypeFnMeta';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.DocumentSymbol[] | null | undefined {
        const { uri } = document;
        const { AhkSymbolList, DocStrMap } = Detecter.updateDocDef(document);

        const DAList: TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
        const baseDiag: vscode.Diagnostic[] = (diagColl.get(uri) || [])
            .filter((diag: vscode.Diagnostic): boolean => diag.source !== EDiagBase.sourceDA);
        diagColl.set(uri, [...baseDiag, ...diagDAFile(DAList)]);

        return AhkSymbolList as vscode.DocumentSymbol[];
    }

    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
