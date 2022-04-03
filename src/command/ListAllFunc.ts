import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';

function getFnNameLineCol(text: string, fsPath: string, startPos: vscode.Position): string {
    const line: number = startPos.line + 1;
    const col: number = startPos.character + 1;
    return `${text} ;${fsPath}:${line}:${col}`;
}

export function ListAllFunc(showLink: boolean): null {
    const t1: number = Date.now();
    const allFsPath: string[] = Detecter.getDocMapFile();

    const AllList: string[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;

        AllList.push(fsPath);

        for (const DocumentSymbol of AhkSymbolList) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;
                const textShow: string = showLink
                    ? getFnNameLineCol(text, fsPath, DocumentSymbol.selectionRange.start)
                    : text;
                AllList.push(textShow);
            }
        }
        AllList.push('\n');
    }

    OutputChannel.clear();
    OutputChannel.appendLine('[neko-help] List All Function()');
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

export function ListAllFuncSort(reverse: boolean): null {
    const t1: number = Date.now();
    const allFsPath: string[] = Detecter.getDocMapFile();

    const AllList: string[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | undefined = Detecter.getDocMap(fsPath)?.AhkSymbolList;
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
    AllList.sort(); // a->z
    const appendText: string = reverse
        ? AllList
            .reverse()
            .join('\n')
        : AllList.join('\n');

    OutputChannel.clear();
    OutputChannel.appendLine('[neko-help] List All Function() Sort;');
    OutputChannel.appendLine(appendText);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}
