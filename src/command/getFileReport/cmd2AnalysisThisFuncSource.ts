import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TFuncRef } from '../../provider/Def/getFnRef';
import { EFnRefBy, fileFuncRef } from '../../provider/Def/getFnRef';

import type { TTokenStream } from '../../globalEnum';
import type { TBiFuncMsg } from '../../tools/Built-in/func.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/func.tools';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';

function unKnowSourceToStrList(DocStrMap: TTokenStream, refUnknown: Map<string, TFuncRef[]>): string[] {
    // fnName = ( LTrm C)
    // ( LTrm C
    // ln xx ; textRaw
    // )
    const arr: string[] = [];

    for (const [k, refList] of refUnknown) {
        arr.push(`${k} =`, '( LTrim C');
        for (const { line, col } of refList) {
            const { textRaw } = DocStrMap[line];
            arr.push(`[ln ${line + 1}, col ${col + 1}] ; ${textRaw.trim()}`);
        }
        arr.push(')');
    }
    return arr;
}

function BuiltInFn2StrList(DocStrMap: TTokenStream, refBuiltInFn: Map<string, [TFuncRef[], TBiFuncMsg]>): string[] {
    // fnName = ( LTrm C)
    // ( LTrm C
    // ln xx ; textRaw
    // )
    const arr: string[] = [];

    for (const [_k, [refList, { keyRawName }]] of refBuiltInFn) {
        arr.push(`${keyRawName} =`, '( LTrim C', `${keyRawName}()`, '[ln, col]');
        for (const { line, col } of refList) {
            const { textRaw } = DocStrMap[line];
            arr.push(`[${line + 1}, ${col + 1}] ; ${textRaw.trim()}`);
        }
        arr.push(')');
    }
    return arr;
}

export function cmd2AnalysisThisFuncSource(document: vscode.TextDocument): null {
    //
    const t1: number = Date.now();
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) {
        void vscode.window.showInformationMessage('neko-help not support ahk v2');
        return null;
    }

    const { DocStrMap } = AhkFileData;
    const refMap: ReadonlyMap<string, TFuncRef[]> = fileFuncRef.up(AhkFileData);
    const fnMap: TFullFuncMap = getAllFunc();

    const refUseDef = new Map<string, [TFuncRef[], CAhkFunc]>();
    const refJustBy2 = new Map<string, [TFuncRef[], CAhkFunc]>(); // by "funcName"
    const refBuiltInFn = new Map<string, [TFuncRef[], TBiFuncMsg]>();
    const refUnknown = new Map<string, TFuncRef[]>();

    for (const [upFnName, RefList] of refMap) {
        const justByRef2: boolean = RefList.every((ref: TFuncRef): boolean => ref.by === EFnRefBy.wordWrap);
        const ahkFunc: CAhkFunc | undefined = fnMap.get(upFnName);
        if (ahkFunc !== undefined) {
            if (justByRef2) {
                refJustBy2.set(upFnName, [RefList, ahkFunc]);
            } else {
                refUseDef.set(upFnName, [RefList, ahkFunc]);
            }
            continue;
        }
        const BuiltInFnMsg: TBiFuncMsg | undefined = getBuiltInFuncMD(upFnName);
        if (BuiltInFnMsg !== undefined) {
            refBuiltInFn.set(upFnName, [RefList, BuiltInFnMsg]);
            continue;
        }
        if (!justByRef2) {
            refUnknown.set(upFnName, RefList);
        }
    }

    const ms: number = Date.now() - t1;
    const content: string = [
        '',
        ';; cmd2_report_this_func_source',
        `source := "${path.basename(document.uri.fsPath)}"`,
        `sourcePath := "${document.uri.fsPath}"`,
        '',
        'unknownSource() {',
        '; Looks like a function, but I can\'t get the source of',
        // fnName = ( LTrm C)
        // ( LTrm C
        // ln xx ; textRaw
        // )
        ...unKnowSourceToStrList(DocStrMap, refUnknown),
        '}',
        '',
        'BuiltInFunc() {',
        '; https://www.autohotkey.com/docs/v1/Functions.htm#BuiltIn',
        ...BuiltInFn2StrList(DocStrMap, refBuiltInFn),
        '}',
        '',
        'MsgBox % "please read https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#find-ref-of-function"',
        `MsgBox % "Done : " ${ms} " ms"`,
        '',
    ].join('\n');
    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content,
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    return null;
}
