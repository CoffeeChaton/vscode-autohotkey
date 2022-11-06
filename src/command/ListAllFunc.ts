import * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { msgWithPos } from './tools/msgWithPos';
import type { TPick } from './TPick';

function ListAllFunc(showLink: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    let funcHint = 0;
    let fileHint = 0;
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        AllList.push(uri.fsPath);

        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;
                const textShow: string = showLink
                    ? msgWithPos(text, uri.fsPath, DocumentSymbol.selectionRange.start)
                    : text;
                AllList.push(textShow);
                funcHint++;
            }
        }
        AllList.push('\n');
        fileHint++;
    }

    OutputChannel.clear();
    OutputChannel.appendLine('[neko-help] List All Function()');
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.appendLine(`file: ${fileHint}`);
    OutputChannel.appendLine(`func: ${funcHint}`);

    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

function ListAllFuncSort(reverse: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    let funcHint = 0;
    let fileHint = 0;
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                AllList.push(msgWithPos(`${DocumentSymbol.name}()`, uri.fsPath, DocumentSymbol.selectionRange.start));
                funcHint++;
            }
        }
        fileHint++;
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
    OutputChannel.appendLine(`\nfile: ${fileHint}`);
    OutputChannel.appendLine(`func: ${funcHint}`);
    OutputChannel.appendLine(`Done in ${Date.now() - t1} ms`);
    OutputChannel.show();

    return null;
}

export function ListAllFuncMain(): void {
    type TCommand = TPick<void>;

    const items: TCommand[] = [
        { label: '1 -> list all Function()', fn: (): null => ListAllFunc(false) },
        { label: '2 -> list all Function() ; link', fn: (): null => ListAllFunc(true) },
        { label: '3 -> list all Function() sort a -> z', fn: (): null => ListAllFuncSort(false) },
        { label: '4 -> list all Function() sort z -> a', fn: (): null => ListAllFuncSort(true) },
    ];

    void vscode.window.showQuickPick<TCommand>(items)
        .then((pick: TPick<void> | undefined): undefined => void pick?.fn());
}
