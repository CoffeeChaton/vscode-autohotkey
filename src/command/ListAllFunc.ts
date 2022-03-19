import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';

function getFnNameLineCol(text: string, fsPath: string, start: vscode.Position): string {
    const line = start.line + 1;
    const column = start.character + 1;
    return `${text} ;${fsPath}:${line}:${column}`;
}

export function ListAllFunc(showLink: boolean): null {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    const AllList: string[] = ['[neko-help] List All Function()'];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;

        AllList.push(fsPath);

        for (const DocumentSymbol of AhkSymbolList) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;
                if (showLink) {
                    AllList.push(getFnNameLineCol(text, fsPath, DocumentSymbol.selectionRange.start));
                } else {
                    AllList.push(text);
                }
            }
        }
        AllList.push('\n');
    }

    OutputChannel.clear();
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

export function ListAllFuncSort(reverse: boolean): null {
    const t1 = Date.now();
    const allFsPath = Detecter.getDocMapFile();

    const AllList: string[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) {
            continue;
        }

        for (const DocumentSymbol of AhkSymbolList) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;

                AllList.push(getFnNameLineCol(text, fsPath, DocumentSymbol.selectionRange.start));
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    AllList.sort();
    const appendText: string = reverse
        ? AllList
            .reverse()
            .join('\n')
        : AllList.join('\n');

    OutputChannel.clear();
    OutputChannel.appendLine('[neko-help] List All Function()');
    OutputChannel.appendLine(appendText);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}
