import * as path from 'path';
import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import { TGValMap } from '../../../globalEnum';

export function globalValCompletion(
    _document: vscode.TextDocument,
    _position: vscode.Position,
    _inputStr: string,
): vscode.CompletionItem[] {
    /**
     * k : valUpName
     * v : has rVal
     *  && fsPath.baseName
     */
    // TODO weakMap md, and  clone md to .appendMarkdown
    const map = new Map<string, vscode.CompletionItem>();

    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const glMap: TGValMap = AhkFileData.GlobalValMap;
        const fileName: string = path.basename(fsPath);

        for (const [valUpName, globalValList] of glMap) {
            if (map.has(valUpName)) continue;

            for (const GlobalVal of globalValList) {
                const { rawName, rVal, lRange } = GlobalVal;
                if (rVal === null) continue;
                const label: vscode.CompletionItemLabel = {
                    label: rawName, // Left
                    description: 'Global', // Right
                };
                const item = new vscode.CompletionItem(label);
                // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
                item.kind = vscode.CompletionItemKind.Variable;
                item.insertText = rawName;
                item.detail = 'Global Variables (neko-help)';
                const ch = lRange.start.character;
                const ln = lRange.start.line;
                const uri = vscode.Uri.parse(fsPath).toString();
                const showFileName = `${fileName} ln:${ln + 1} ch:${ch + 1}`;
                item.documentation = new vscode.MarkdownString('', true)
                    .appendMarkdown(
                        `[${showFileName}](file:///${uri})\n\n`,
                    )
                    .appendCodeblock(`Global ${rawName} := ${rVal}`, 'ahk');

                map.set(valUpName, item);
            }
        }
    }

    return [...map.values()];
}
