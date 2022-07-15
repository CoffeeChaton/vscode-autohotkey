import * as vscode from 'vscode';
import { TTextMapOut, TTextMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EPrefix } from '../../../../tools/MD/setMD';
import { setItemCore } from './setItem';

export function getUnknownTextCompletion(
    textMap: TTextMapOut,
    funcName: string,
): vscode.CompletionItem[] {
    return [...textMap.values()].map((v: TTextMetaOut): vscode.CompletionItem => {
        const { keyRawName, refRangeList } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: EPrefix.unKnownText,
            recMap: new Map(),
            keyRawName,
            funcName,
            refRangeList,
            defRangeList: [],
            kind: vscode.CompletionItemKind.Text,
        });
        return item;
    });
}
