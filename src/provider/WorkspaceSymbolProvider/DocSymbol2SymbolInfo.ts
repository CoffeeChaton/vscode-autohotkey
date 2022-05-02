import * as vscode from 'vscode';
import { TAhkSymbol, TAhkSymbolList } from '../../TAhkSymbolIn';

const wm: WeakMap<TAhkSymbolList, vscode.SymbolInformation[]> = new WeakMap();

export function DocSymbol2SymbolInfo(fsPath: string, AhkSymbolList: TAhkSymbolList): vscode.SymbolInformation[] {
    const cache: vscode.SymbolInformation[] | undefined = wm.get(AhkSymbolList);
    if (cache !== undefined) return cache;

    const uri: vscode.Uri = vscode.Uri.file(fsPath);

    const result: vscode.SymbolInformation[] = AhkSymbolList.map(
        (AhkSymbol: TAhkSymbol): vscode.SymbolInformation => {
            const {
                name,
                kind,
                range,
                detail,
            } = AhkSymbol;
            const containerName: string = detail;
            const location: vscode.Location = new vscode.Location(uri, range);

            return new vscode.SymbolInformation(name, kind, containerName, location);
        },
    );

    wm.set(AhkSymbolList, result);
    return result;
}
