/* eslint-disable @typescript-eslint/require-array-sort-compare */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbolList } from '../globalEnum';

export async function CommandListAllFunc(showArgs: boolean, showLink: boolean): Promise<null> {
    const allFsPath = Detecter.getDocMapFile();

    const AllList: string[] = ['[neko-help] List All Function'];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | null = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) {
            continue;
        }

        AllList.push(fsPath);

        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(fsPath);

        for (const DocumentSymbol of AhkSymbolList) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = showArgs
                    ? document.getText(DocumentSymbol.selectionRange).replaceAll(/\n\s*/g, '')
                    : `${DocumentSymbol.name}()`;
                if (showLink) {
                    const line = DocumentSymbol.selectionRange.start.line + 1;
                    const column = DocumentSymbol.selectionRange.start.character + 1;
                    AllList.push(`${text} ;${fsPath}:${line}:${column}`);
                } else {
                    AllList.push(text);
                }
            }
        }
        AllList.push('\n');
    }

    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.append(AllList.join('\n'));
    OutputChannel.show();

    return null;
}
export async function CommandListAllFuncSort(reverse: boolean): Promise<null> {
    const allFsPath = Detecter.getDocMapFile();

    const AllList: string[] = [];
    for (const fsPath of allFsPath) {
        const AhkSymbolList: TAhkSymbolList | null = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) {
            continue;
        }

        for (const DocumentSymbol of AhkSymbolList) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;

                const line = DocumentSymbol.selectionRange.start.line + 1;
                const column = DocumentSymbol.selectionRange.start.character + 1;
                AllList.push(`${text} ;${fsPath}:${line}:${column}`);
            }
        }
    }

    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');

    OutputChannel.appendLine('[neko-help] List All Function');

    const appendText: string = reverse
        ? AllList.sort()
            .reverse()
            .join('\n')
        : AllList.sort().join('\n');
    OutputChannel.append(appendText);
    OutputChannel.show();

    return null;
}
