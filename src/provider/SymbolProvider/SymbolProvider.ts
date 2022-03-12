/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { diagColl } from '../../core/diagRoot';
import { EDiagBase } from '../../globalEnum';
import { diagDAFile } from '../../tools/DeepAnalysis/Diag/diagDA';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    public async provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): Promise<vscode.DocumentSymbol[] | null | undefined> {
        const {
            AhkSymbolList,
        } = await Detecter.updateDocDef(true, document.uri.fsPath);

        const { uri } = document;

        const otherDiag = (diagColl.get(uri) || [])
            .filter((v) => v.source !== EDiagBase.sourceDA);
        diagColl.set(uri, [...otherDiag, ...diagDAFile(AhkSymbolList, document)]);

        return AhkSymbolList as vscode.DocumentSymbol[];
    }
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
