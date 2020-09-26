/* eslint-disable no-unused-vars */
/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
/*
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { tryGetSymbol } from './DefProvider';
import { EMode } from '../tools/globalSet';

export class CompletionComma implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const Range = document.getWordRangeAtPosition(new vscode.Position(position.line, position.character - 1));
        if (Range === undefined) return null;
        const word = document.getText(Range);
        const result: vscode.CompletionItem[] = [];
        const inClassList = [Detecter.getDocMap()];
        const kinds = [vscode.CompletionItemKind.Method, vscode.CompletionItemKind.Class];
        const iMax = inClassList.length;

        const resultPush = (fsPath: string | undefined): void => {
            if (fsPath) {
                for (let i = 0; i < iMax; i += 1) {
                    const inClass = inClassList[i];
                    const classInsides = inClass.get(fsPath) || [];
                    for (const classInside of classInsides) {
                        // FIXME    if (classInside.containerName.toLowerCase() !== word2.toLowerCase()) continue;
                        const kind = kinds[i];
                        let Name = classInside.name;
                        if (kind === vscode.CompletionItemKind.Method) Name += '()';
                        const CompletionItem = new vscode.CompletionItem(Name, kinds[i]);
                        result.push(CompletionItem);
                    }
                }
            }
        };

        const [, fsPath] = tryGetSymbol(word, EMode.ahkClass);
        resultPush(fsPath);

        let startLine = 0;
        let endLine = position.line;
        const thisDocFuncList = Detecter.getFuncMap().get(document.uri.fsPath) || [];
        for (const func of thisDocFuncList) {
            if (func.range.contains(position)) {
                startLine = func.range.start.line;
                endLine = func.range.end.line;
                break;
            }
        }
        const usingNew = new RegExp(`^${word}\\s*:=\\s*new\\s\\s*(\\w\\w*)`);
        for (let line = endLine; line >= startLine; line -= 1) {
            const execArray = usingNew.exec(document.lineAt(line).text.trim());
            if (execArray === null) continue;
            const wordLower = execArray[1].toLowerCase();
            const [, fsPath2] = tryGetSymbol(wordLower, EMode.ahkClass);
            resultPush(fsPath2);
            break;
        }
        // TODO     InstanceVar  static ClassVar     Property[]
        return result;
    }

    // resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
    //     const label = 'TODO-----18118-----';
    //     const kind = vscode.CompletionItemKind.Class;
    //     return new vscode.CompletionItem(label, kind);
    // }
}
*/
