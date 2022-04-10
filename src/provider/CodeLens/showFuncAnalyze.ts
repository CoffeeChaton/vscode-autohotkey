import { msgWithPos } from '../../command/ListAllFunc';
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
import { OutputChannel as out } from '../vscWindows/OutputChannel';
import { commandAnalyze } from './commandAnalyze';
import { refFuncAnalyze } from './refFuncAnalyze';

function showElement(map: TValMap | TParamMap | TTextMap): string {
    if (map.size === 0) return '';

    const arr: string[] = [];
    for (const { keyRawName } of map.values()) {
        arr.push(`"${keyRawName}"`);
    }
    return arr.join(', ');
}
// --------
export type TShowAnalyze = [TDAMeta, TFsPath, TTokenStream];

export function showFuncAnalyze(a: TShowAnalyze): void {
    const DA: TDAMeta = a[0];
    const fsPath: string = a[1];
    const AhkTokenList: TTokenStream = a[2];
    const fullFuncMap: TFullFuncMap = getAllFunc();
    out.clear();
    out.appendLine('"---------------- Base Data Start -----------------------------"');
    out.appendLine(msgWithPos(`About ${DA.funcRawName}(...)`, fsPath, DA.range.start));
    out.appendLine(`param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`);
    out.appendLine(`value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`);
    out.appendLine(`unknownText : ${DA.textMap.size} of [${showElement(DA.textMap)}]`);
    out.appendLine('"---------------- Base Data End -----------------------------"');
    out.appendLine('"---------------- showAnalyze Start -------------------------"');
    commandAnalyze(AhkTokenList, fsPath, fullFuncMap);
    refFuncAnalyze(AhkTokenList, fsPath, fullFuncMap);
    out.appendLine('"---------------- showAnalyze End ---------------------------"');
    out.show();
}
