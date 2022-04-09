import {
    TFsPath,
    TTokenStream,
} from '../../globalEnum';
import { TDAMeta, TParamMap, TValMap } from '../../tools/DeepAnalysis/TypeFnMeta';
import { OutputChannel as out } from '../vscWindows/OutputChannel';

function showElement(map: TValMap | TParamMap): string {
    if (map.size === 0) return '';

    const arr: string[] = [];
    for (const { keyRawName } of map.values()) {
        arr.push(`"${keyRawName}"`);
    }
    return arr.join(', ');
}
// function commandAnalyze(params: type) {
// }

// --------
export type TShowAnalyze = [TDAMeta, TFsPath, TTokenStream];

export function showFuncAnalyze(a: TShowAnalyze): void {
    const DA: TDAMeta = a[0];
    const fsPath: string = a[1];
    // eslint-disable-next-line no-magic-numbers
    const AhkTokenList: TTokenStream = a[2];
    console.log('🚀 ~ showDA ~ DA', DA);
    console.log('🚀 ~ showFuncAnalyze ~ fsPath', fsPath);
    console.log('🚀 ~ showFuncAnalyze ~ AhkTokenList', AhkTokenList);

    out.clear();
    out.appendLine('---------------- Base Data Start-----------------------------');
    out.appendLine(`About ${DA.selectionRangeText}`);
    out.appendLine(`param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`);
    out.appendLine(`value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`);
    out.appendLine('---------------- Base Data End-----------------------------');
    out.appendLine('---------------- showAnalyze Start ---------------------');
    out.appendLine('---------------- TODO ---------------------');
    out.appendLine('---------------- showAnalyze End -----------------------');
    out.show();
}

// {
//     kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function;
//     paramMap: TParamMap;
//     valMap: TValMap;
//     textMap: TTextMap;
//     funcRawName: string;
//     upName: string;
//     selectionRangeText: string;
//     range: vscode.Range; // copy ?
//     md: vscode.MarkdownString;
// }
