import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';

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

    const AllList: string[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;

        const List: string[] = [];
        collectInclude(List, AhkSymbolList);
        if (List.length > 0) {
            AllList.push(`\n${fsPath}`, ...List);
        }
    }

    OutputChannel.clear();
    OutputChannel.appendLine('[neko-help] List All #Include');
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.appendLine('\n');
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}
