import * as vscode from 'vscode';
import { TAhkSymbol, TAhkSymbolList } from '../../TAhkSymbolIn';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const wm: ClassWm<TAhkSymbolList, vscode.SymbolInformation[]> = new ClassWm(10 * 60 * 1000, 'DocSymbol2SymbolInfo', 0);

export function DocSymbol2SymbolInfo(fsPath: string, AhkSymbolList: TAhkSymbolList): vscode.SymbolInformation[] {
    const cache: vscode.SymbolInformation[] | undefined = wm.getWm(AhkSymbolList);
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

    return wm.setWm(AhkSymbolList, result);
}
