import * as vscode from 'vscode';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import {
    TDAMeta, TParamMeta, TTextMeta, TValMeta,
} from '../../tools/DeepAnalysis/TypeFnMeta';

function rangeList2LocList(rangeList: vscode.Range[], uri: vscode.Uri): vscode.Location[] {
    return rangeList.map((range) => new vscode.Location(uri, range));
}

function metaRangeList(
    defRangeList: vscode.Range[],
    refRangeList: vscode.Range[],
    listAllUsing: boolean,
    position: vscode.Position,
    uri: vscode.Uri,
): vscode.Location[] {
    if (listAllUsing) {
        return rangeList2LocList([...defRangeList, ...refRangeList], uri);
    }

    if (defRangeList[0].contains(position)) {
        // <
        // when I open "editor.gotoLocation.alternativeDefinitionCommand": "editor.action.goToReferences"
        // why vscode can't Identify range.contains(position)
        //      , and auto let F12 -> shift F12 ?
        //           (auto let goto Def -> Ref)
        // What else I need to read/Do?
        // return [...defRangeList, ...refRangeList];
        // >
        // OK..i know who to go to References...
        return [new vscode.Location(uri, position)];
    }
    return rangeList2LocList(defRangeList, uri);
}

export function getValDefInFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const { uri } = document;
    const DA: TDAMeta | undefined = getDAWithPos(document, position);
    if (DA === undefined) return null;

    const {
        paramMap,
        valMap,
        textMap,
    } = DA;
    const argMeta: TParamMeta | undefined = paramMap.get(wordUp);
    if (argMeta !== undefined) {
        const { defRangeList, refRangeList } = argMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const valMeta: TValMeta | undefined = valMap.get(wordUp);
    if (valMeta !== undefined) {
        const { defRangeList, refRangeList } = valMeta;
        return metaRangeList(defRangeList, refRangeList, listAllUsing, position, uri);
    }

    const textList: TTextMeta | undefined = textMap.get(wordUp);

    return textList
        ? rangeList2LocList(textList.refRangeList, uri)
        : null;
}
