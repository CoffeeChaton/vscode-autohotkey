import * as vscode from 'vscode';
import {
    TFsPath,
    TTokenStream,
} from '../../globalEnum';
import {
    TDAMeta,
    TParamMap,
    TTextMap,
    TValMap,
} from '../../tools/DeepAnalysis/TypeFnMeta';
import { getAllFunc, TFullFuncMap } from '../../tools/Func/getAllFunc';
import { commandAnalyze } from './commandAnalyze';
import { refFuncAnalyze } from './refFuncAnalyze';

function showElement(map: TValMap | TParamMap | TTextMap): string {
    if (map.size === 0) return '';

    const arr: string[] = [];
    for (const { keyRawName } of map.values()) {
        arr.push(keyRawName);
    }
    return arr.join(', ');
}
// --------
export type TShowAnalyze = [TDAMeta, TFsPath, TTokenStream];

export async function showFuncAnalyze(DA: TDAMeta, fsPath: string, AhkTokenList: TTokenStream): Promise<void> {
    const fullFuncMap: TFullFuncMap = getAllFunc();

    const ed: string[] = [
        `Analyze_of_${DA.funcRawName}() {`,
        '/**',
        '* Base Data',
        `* @param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`,
        `* @value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`,
        `* @unknownText : ${DA.textMap.size} of [${showElement(DA.textMap)}]`,
        '*/',
        '',
        ...commandAnalyze(AhkTokenList, fullFuncMap),
        ...refFuncAnalyze(AhkTokenList, fullFuncMap),
        '}',
        ';; Analyze End',
    ];

    const myDoc: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content: ed.join('\n'),
    });
    await vscode.window.showTextDocument(myDoc);
}
