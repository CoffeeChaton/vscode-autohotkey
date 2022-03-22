import * as vscode from 'vscode';
import { TAhkSymbolList } from '../../globalEnum';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbolList, vscode.SymbolInformation[]>(10 * 60 * 1000, 'DocSymbol2SymbolInfo', 7000);

export function DocSymbol2SymbolInfo(fsPath: string, AhkSymbolList: TAhkSymbolList): vscode.SymbolInformation[] {
    const cache = wm.getWm(AhkSymbolList);
    if (cache) return cache;

    const uri: vscode.Uri = vscode.Uri.file(fsPath);

    const result: vscode.SymbolInformation[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        const {
            name,
            kind,
            range,
            detail,
        } = AhkSymbol;
        const containerName: string = detail;
        const location = new vscode.Location(uri, range);
        result.push(new vscode.SymbolInformation(name, kind, containerName, location));
    }

    return wm.setWm(AhkSymbolList, result);
}
