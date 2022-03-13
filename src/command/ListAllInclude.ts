import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';

function collectInclude(List: string[], AhkSymbolList: TAhkSymbolList): void {
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind === vscode.SymbolKind.Event) {
            const { detail } = AhkSymbol;
            if (detail === '#IncludeAgain' || detail === '#Include') {
                List.push(AhkSymbol.name);
            }
        } else {
            collectInclude(List, AhkSymbol.children);
        }
    }
}

export function ListAllInclude(): null {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    const AllList: string[] = ['[neko-help] List All #Include'];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;

        const List: string[] = [];
        List.push(fsPath);

        collectInclude(List, AhkSymbolList);

        if (List.length > 1) {
            AllList.push(...List, '\n');
        }
    }

    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}
