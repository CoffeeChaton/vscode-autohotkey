import * as vscode from 'vscode';
import {
    CAhkFuncSymbol,
    EFormatChannel,
    TFsPath,
    TParamMapOut,
    TTextMapOut,
    TTokenStream,
    TValMapOut,
} from '../../globalEnum';
import { getAllFunc, TFullFuncMap } from '../../tools/Func/getAllFunc';
import { FormatCore } from '../Format/FormatProvider';
import { commandAnalyze } from './commandAnalyze';
import { refFuncAnalyze } from './refFuncAnalyze';

function showElement(map: TValMapOut | TParamMapOut | TTextMapOut): string {
    if (map.size === 0) return '';

    const arr: string[] = [];
    for (const { keyRawName } of map.values()) {
        arr.push(keyRawName);
    }
    return arr.join(', ');
}
// --------

async function fmtAnalyze(document: vscode.TextDocument): Promise<void> {
    const TextEdit: vscode.TextEdit[] | null | undefined = await FormatCore({
        document,
        options: {
            tabSize: 4,
            insertSpaces: true,
        },
        fmtStart: 0,
        fmtEnd: document.lineCount - 1,
        from: EFormatChannel.byFormatAllFile,
        needDiff: true,
    });

    if (TextEdit) {
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        edit.set(document.uri, TextEdit);
        await vscode.workspace.applyEdit(edit);
    }
}

function baseDataAnalyze(DA: CAhkFuncSymbol): string[] {
    return [
        `${DA.name}() ;`,
        '/**',
        `* @Analyze ${DA.name}`,
        '* ',
        '* @Base Data',
        '* ',
        `* @param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`,
        `* @value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`,
        `* @unknownText : ${DA.textMap.size} of [${showElement(DA.textMap)}]`,
        '*/',
    ];
}

export type TShowAnalyze = [CAhkFuncSymbol, TFsPath, TTokenStream];

export async function showFuncAnalyze(DA: CAhkFuncSymbol, fsPath: string, AhkTokenList: TTokenStream): Promise<void> {
    const fullFuncMap: TFullFuncMap = getAllFunc();

    const ed: string[] = [
        `Analyze_Results_of_${DA.name}() {`,
        ...baseDataAnalyze(DA),
        '',
        ...commandAnalyze(AhkTokenList, fullFuncMap),
        ...refFuncAnalyze(AhkTokenList, fullFuncMap),
        '}',
        ';; Analyze End',
    ];

    const document: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content: ed.join('\n'),
    });

    await fmtAnalyze(document);

    await vscode.window.showTextDocument(document);
}
