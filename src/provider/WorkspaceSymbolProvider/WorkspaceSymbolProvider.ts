import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { TAhkSymbolList } from '../../globalEnum';
import { DocSymbol2SymbolInfo } from './DocSymbol2SymbolInfo';

export function WorkspaceSymbolCore(): vscode.SymbolInformation[] {
    const result: vscode.SymbolInformation[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPathList) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList !== undefined) {
            result.push(...DocSymbol2SymbolInfo(fsPath, AhkSymbolList));
        }
    }

    return result;
}

/**
 * ctrl + T, list All Symbol
 */
export class WorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideWorkspaceSymbols(
        _query: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return WorkspaceSymbolCore();
    }

    // resolveWorkspaceSymbol?(symbol: T, token: vscodeCancellationToken): vscode.ProviderResult<T> {
    //     return [];
    // }
}
