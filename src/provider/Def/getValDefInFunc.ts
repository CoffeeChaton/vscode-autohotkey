import * as vscode from 'vscode';
import {
    CAhkFuncSymbol,
    TParamMetaOut,
    TTextMetaOut,
    TValMetaOut,
} from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';

function rangeList2LocList(rangeList: readonly vscode.Range[], uri: vscode.Uri): vscode.Location[] {
    return rangeList.map((range) => new vscode.Location(uri, range));
}

function metaRangeList(
    defRangeList: readonly vscode.Range[],
    refRangeList: readonly vscode.Range[],
    listAllUsing: boolean,
    position: vscode.Position,
    uri: vscode.Uri,
): vscode.Location[] {
    if (listAllUsing) {
        return rangeList2LocList([...defRangeList, ...refRangeList], uri);
    }

    if (defRangeList[0].contains(position)) {
        // // <
        // // when I open "editor.gotoLocation.alternativeDefinitionCommand": "editor.action.goToReferences"
        // // why vscode can't Identify range.contains(position)
        // //      , and auto let F12 -> shift F12 ?
        // //           (auto let goto Def -> Ref)
        // // What else I need to read/Do?
        // // return [...defRangeList, ...refRangeList];
        // // >
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(uri, position)];
    }
    return rangeList2LocList(defRangeList, uri);
}

export function getValWithDA(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const { uri } = document;
    const DA: CAhkFuncSymbol | undefined = getDAWithPos(document, position);
    if (DA === undefined) return null;

    const {
        paramMap,
        valMap,
        textMap,
    } = DA;
    const argMeta: TParamMetaOut | undefined = paramMap.get(wordUp);
    if (argMeta !== undefined) {
        const { defRangeList, refRangeList } = argMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const valMeta: TValMetaOut | undefined = valMap.get(wordUp);
    if (valMeta !== undefined) {
        const { defRangeList, refRangeList } = valMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const textList: TTextMetaOut | undefined = textMap.get(wordUp);

    return textList
        ? rangeList2LocList(textList.refRangeList, uri)
        : null;
}
