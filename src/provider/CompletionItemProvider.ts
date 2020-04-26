/* eslint-disable no-unused-vars */
/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { tryGetSymbol } from './DefProvider';
import { EMode } from '../tools/globalSet';
import getFuncParm from '../tools/getFuncParm';

class CompletionComma implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken, context: vscode.CompletionContext)
        : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList | null> {
        const result: vscode.CompletionItem[] = [];
        const kind = vscode.CompletionItemKind.Color;
        const { text } = document.lineAt(position.line);// TODO CompletionItemProvider
        const position2 = new vscode.Position(position.line, position.character - 1);
        const Range = document.getWordRangeAtPosition(position2);
        if (Range === undefined) return null;
        const objName = document.getText(Range);
        const AhkSymbol = tryGetSymbol(objName, EMode.ahkClass);
        if (AhkSymbol) {
            const CompletionItem = new vscode.CompletionItem(objName, kind); // TODO search for class methods
            CompletionItem.commitCharacters = ['\t', '.'];
            CompletionItem.detail = 'ahkOutline IntelliSense';
            CompletionItem.documentation = 'TODO--21--89--564';
            CompletionItem.preselect = true;
            result.push(CompletionItem);
            return result;
        }
        //  TODO const objName = for ( text -- )
        // const AhkSymbol = tryGetSymbol(objName, EMode.ahkClass);
        // if (AhkSymbol) {
        // }
        return null;
    }

    // eslint-disable-next-line class-methods-use-this
    resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        const label = 'TODO-----18118-----';// TODO
        const kind = vscode.CompletionItemKind.Class;
        return new vscode.CompletionItem(label, kind);
    }
}

// TODO fn_name(,,)
export class CompletionFunc implements vscode.CompletionItemProvider {
    // eslint-disable-next-line class-methods-use-this
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken, context: vscode.CompletionContext)
        : vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList | null> {
        return new Promise(() => {
            const result: vscode.CompletionItem[] = [];
            const kind = vscode.CompletionItemKind.Color;
            const position2 = new vscode.Position(position.line, position.character - 2);
            const Range = document.getWordRangeAtPosition(position2);
            if (Range === undefined) return null;
            const funcName = document.getText(Range);
            const AhkSymbol = tryGetSymbol(funcName, EMode.ahkFunc);
            if (AhkSymbol) {
                const CompletionItem = new vscode.CompletionItem(funcName, kind);
                CompletionItem.commitCharacters = ['(', 'func'];
                CompletionItem.detail = 'ahkOutline IntelliSense';
                CompletionItem.documentation = 'TODO--21--89--564';
                CompletionItem.preselect = true;
                // FIXME
                CompletionItem.label = 'str';// getFuncParm(await vscode.workspace.openTextDocument(AhkSymbol.location.uri), AhkSymbol, true);
                result.push(CompletionItem);
                return result;
            }
            //  TODO *3 const objName = for ( text -- )
            // const AhkSymbol = tryGetSymbol(objName, EMode.ahkClass);
            // if (AhkSymbol) {
            // }
            return null;
        });
    }

    // eslint-disable-next-line class-methods-use-this
    resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem> {
        return item;
    }
}
