import * as vscode from 'vscode';
import { TAhkSymbol, TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { Detecter } from '../../core/Detecter';

function toSymbolInfo(AhkSymbol: TAhkSymbol): vscode.SymbolInformation {
    const {
        name,
        kind,
        range,
        detail,
    } = AhkSymbol;

    return new vscode.SymbolInformation(name, kind, detail, new vscode.Location(AhkSymbol.uri, range));
}

const wm: WeakMap<readonly TTopSymbol[], vscode.SymbolInformation[]> = new WeakMap(); // 4ms -> 0ms

function DocSymbol2SymbolInfo(AhkSymbolList: readonly TTopSymbol[]): vscode.SymbolInformation[] {
    const cache: vscode.SymbolInformation[] | undefined = wm.get(AhkSymbolList);
    if (cache !== undefined) return cache;

    const result: vscode.SymbolInformation[] = AhkSymbolList.map(toSymbolInfo);

    wm.set(AhkSymbolList, result);
    return result;
}

function WorkspaceSymbolCore(): vscode.SymbolInformation[] {
    const result: vscode.SymbolInformation[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPathList) {
        const AhkSymbolList: readonly TTopSymbol[] | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;

        result.push(...DocSymbol2SymbolInfo(AhkSymbolList));
    }

    return result;
}

/**
 * ctrl + T, list All Symbol
 */
export const WorkspaceSymbolProvider: vscode.WorkspaceSymbolProvider = {
    provideWorkspaceSymbols(
        _query: string,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SymbolInformation[]> {
        return WorkspaceSymbolCore();
    },
    // resolveWorkspaceSymbol?(symbol: T, token: vscodeCancellationToken): vscode.ProviderResult<T> {
    //     return [];
    // }
};
