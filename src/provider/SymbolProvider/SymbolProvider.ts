/* eslint-disable class-methods-use-this */
import * as path from 'path';
import * as vscode from 'vscode';
import { showTimeSpend } from '../../configUI';
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
        const {
            AhkSymbolList,
            t1,
            t2,
        } = Detecter.updateDocDef(document);
        showTimeSpend(path.basename(uri.fsPath), t2 - t1);

        const otherDiag = (diagColl.get(uri) || [])
            .filter((v) => v.source !== EDiagBase.sourceDA);
        diagColl.set(uri, [...otherDiag, ...diagDAFile(AhkSymbolList, document)]);

        return AhkSymbolList as vscode.DocumentSymbol[];
    }
    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
