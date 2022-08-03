import * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import type { TPick } from './TPick';

function msgWithPos(text: string, fsPath: string, startPos: vscode.Position): string {
    const line: number = startPos.line + 1;
    const col: number = startPos.character + 1;
    return `${text} ;${fsPath}:${line}:${col}`;
}

function ListAllFunc(showLink: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        AllList.push(uri.fsPath);

        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;
                const textShow: string = showLink
                    ? msgWithPos(text, uri.fsPath, DocumentSymbol.selectionRange.start)
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

function ListAllFuncSort(reverse: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                AllList.push(msgWithPos(`${DocumentSymbol.name}()`, uri.fsPath, DocumentSymbol.selectionRange.start));
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

    const re = !reverse
        ? 'a -> z'
        : 'z -> a';

    OutputChannel.clear();
    OutputChannel.appendLine(`[neko-help] List All Function() ; Sort with ${re}`);
    OutputChannel.appendLine(appendText);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

export async function ListAllFuncMain(): Promise<void> {
    type TCommand = TPick<void>;

    const items: TCommand[] = [
        { label: '1 -> list all Function()', fn: (): null => ListAllFunc(false) },
        { label: '2 -> list all Function() ; link', fn: (): null => ListAllFunc(true) },
        { label: '3 -> list all Function() sort a -> z', fn: (): null => ListAllFuncSort(false) },
        { label: '4 -> list all Function() sort z -> a', fn: (): null => ListAllFuncSort(true) },
    ];

    const pick: TPick<void> | undefined = await vscode.window.showQuickPick<TCommand>(items);

    await pick?.fn();
}
