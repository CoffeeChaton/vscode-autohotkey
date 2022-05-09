import * as vscode from 'vscode';
import { TAhkSymbol, TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';

function toSymbolInfo(AhkSymbol: TAhkSymbol): vscode.SymbolInformation {
    const {
        name,
        kind,
        range,
        detail,
    } = AhkSymbol;
    const containerName: string = detail;
    const location: vscode.Location = new vscode.Location(AhkSymbol.uri, range);

    return new vscode.SymbolInformation(name, kind, containerName, location);
}

const wm: WeakMap<TAhkSymbolList, vscode.SymbolInformation[]> = new WeakMap();

export function DocSymbol2SymbolInfo(AhkSymbolList: TAhkSymbolList): vscode.SymbolInformation[] {
    const cache: vscode.SymbolInformation[] | undefined = wm.get(AhkSymbolList);
    if (cache !== undefined) return cache;

    const result: vscode.SymbolInformation[] = AhkSymbolList.map(toSymbolInfo);

    wm.set(AhkSymbolList, result);
    return result;
}
