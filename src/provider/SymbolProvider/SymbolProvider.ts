import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';

export class SymBolProvider implements vscode.DocumentSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentSymbols(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.DocumentSymbol[] | null | undefined {
        const { AhkSymbolList, DocStrMap, DAList } = Detecter.updateDocDef(document);

        digDAFile(DAList, document.uri);

        return AhkSymbolList as vscode.DocumentSymbol[];
    }

    // May 08 2020, vscode.SymbolInformation  -> vscode.DocumentSymbol[]
}
