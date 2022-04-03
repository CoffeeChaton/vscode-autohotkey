/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { diagColl } from '../../core/diagRoot';
import { EDiagBase } from '../../globalEnum';
import { diagDAFile } from '../../tools/DeepAnalysis/Diag/diagDA';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.DocumentSymbol[] | null | undefined {
        const { uri } = document;
        const { AhkSymbolList } = Detecter.updateDocDef(document);

        const otherDiag: vscode.Diagnostic[] = (diagColl.get(uri) || [])
            .filter((v: vscode.Diagnostic): boolean => v.source !== EDiagBase.sourceDA);
        diagColl.set(uri, [...otherDiag, ...diagDAFile(AhkSymbolList, document)]);

        return AhkSymbolList as vscode.DocumentSymbol[];
    }

    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
