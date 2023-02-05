/* eslint-disable max-lines-per-function */
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFuncRef } from '../../provider/Def/getFnRef';
import { log } from '../../provider/vscWindows/log';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';

type TRef = {
    Ref0: readonly string[],
    Ref1: readonly string[],
    RefN: readonly string[],
};

/**
 * Number of references for each function
 */
function getEachFnRefNumber(AhkFileData: TAhkFileData): TRef {
    const Ref0: string[] = [];
    const Ref1: string[] = [];
    const RefN: string[] = [];

    for (const funcSymbol of getFileAllFunc.up(AhkFileData.AST)) {
        const len: number = getFuncRef(funcSymbol).length - 1;
        const { name } = funcSymbol;
        switch (len) {
            case 0:
                Ref0.push(`${name}()`);
                break;

            case 1:
                Ref1.push(`${name}()`);
                break;

            default:
                RefN.push(`${name}() ; ${len}`);
                break;
        }
    }

    return {
        Ref0,
        Ref1,
        RefN,
    };
}

function AnalysisFuncReference(document: vscode.TextDocument): null {
    const t1 = Date.now();
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) {
        void vscode.window.showInformationMessage('neko-help not support ahk v2');
        return null;
    }

    const { Ref0, Ref1, RefN } = getEachFnRefNumber(AhkFileData);
    const ms: number = Date.now() - t1;
    const content: string = [
        '',
        'Class Class_Report_fn_ref',
        '{',
        '',
        `    static source := "${path.basename(document.uri.fsPath)}"`,
        `    static sourcePath := "${document.uri.fsPath}"`,
        '',
        '    Ref0() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                never user`n',
        // '                fnA()',
        ...Ref0.map((str: string): string => `                ${str}`),
        // '                fnC()',
        '            )',
        '    }',
        '',
        '    Ref1() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                only used in 1 place`n',
        ...Ref1.map((str: string): string => `                ${str}`),
        '            )',
        '    }',
        '',
        '    RefMore() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                RefMore`n',
        ...RefN.map((str: string): string => `                ${str}`),
        '            )',
        '    }',
        '}',
        '',
        'MsgBox % Class_Report_fn_ref.sourcePath ',
        '',
        'Class_Report_fn_ref.Ref0()',
        'Class_Report_fn_ref.Ref1()',
        'Class_Report_fn_ref.RefN()',
        '',
        `MsgBox % "Done : " ${ms} " ms"`,
        '',
        'funcName(){',
        '    ;save this file to try gotoDef && find-all-references',
        '    Return "ABC"',
        '}',
        'exp1(){',
        '    funcName := funcName();',
        '    ;X          ^',
        '    ;var-name   ref-with-style1',
        '    ;ahk-v1 is allow var-name lookLike functionName',
        '',
        '    someString := "funcName"',
        '    ;              ^',
        '    fnObj := func(someString)',
        '    fnObj := RegisterCallback(someString)',
        '    OnMessage(MsgNumber , someString)',
        '    ; sometime we need to use str -> func(str) / RegisterCallback(str)',
        '',
        '    MsgBox % "funcName" funcName funcName() "funcName" funcName funcName "funcName("',
        '    ;         ^         X        ^           ^         X        X         X',
        '}',
        '',
        'exp2(){',
        '',
        '    Hotkey, KeyName , funcName, Options',
        '    ;                 ^------------------label || func || funcObj',
        '    ;Hotkey, IfWinActive/Exist , WinTitle, WinText ; Not-func-ref of this cmd line',
        '    ;Hotkey, If , Expression ; Not-func-ref of this cmd line',
        '    ;Hotkey, If, % FunctionObject ; Not-func-ref of this cmd line',
        '',
        '    SetTimer , funcName, PeriodOnOffDelete, Priority',
        '    ;            ^-----------------------label || func || funcObj',
        '    Menu, MenuName, Add , MenuItemName, funcName, Options',
        '    ;                                   ^-----------------------label || func || funcObj ',
        '    Menu, MenuName, Add , funcName ;If LabelOrSubmenu is omitted, MenuItemName will be used as both the label and the menu item\'s name.',
        '    ;                     ^-----------------------label || func || funcObj ',
        '}',
        '',
        'MsgBox % "suggest to use ctrl + shift + f to search other case" ',
        'TODO(){ ; TODO func-Ref-case',
        '    ;Sort F-flag https://www.autohotkey.com/docs/v1/lib/Sort.htm#Options',
        '    ;F MyFunction [v1.0.47+]',
        '',
        '    ; <https://www.autohotkey.com/docs/v1/misc/Labels.htm#Functions',
        '    ; - TODO [Gui events](https://www.autohotkey.com/docs/v1/lib/Gui.htm#Labels) such as GuiClose',
        '}',
        '',
        'notPlanToSupport(){',
        '    ;NOT plan to support-----------------------',
        '    ;https://www.autohotkey.com/docs/v1/Objects.htm#Function_References',
        '    RetVal := %Func%(Params)     ; Requires [v1.1.07+]',
        '    RetVal := Func.Call(Params)  ; Requires [v1.1.19+]',
        '    RetVal := Func.(Params)      ; Not recommended',
        '',
        '    ;https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions',
        '    RegExMatch(Haystack, "i)(The) (\\w+)\\b(?CCallout)")',
        '    ;                                         ^Callout',
        '',
        '    ;https://www.autohotkey.com/docs/v1/Variables.htm#ref',
        '    cc := fn%i%();',
        '}',
        '',
    ].join('\r\n');

    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content,
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    //  log.info(`AnalysisFuncReference of "${document.fileName}" , use ${ms} ms`);
    return null;
}

export function AnalysisFuncReferenceWrap(): null {
    //
    const visibleList: readonly vscode.TextEditor[] = vscode.window.visibleTextEditors;
    const visibleListAhk: readonly vscode.TextDocument[] = visibleList
        .filter(({ document }: vscode.TextEditor) => (document.languageId === 'ahk' && isAhkTab(document.uri)))
        .map(({ document }: vscode.TextEditor): vscode.TextDocument => document);

    if (visibleListAhk.length === 0) {
        void vscode.window.showInformationMessage('you don\'t open any ahk file');
    }
    if (visibleListAhk.length === 1) {
        void AnalysisFuncReference(visibleListAhk[0]);
        return null;
    }

    type TPick = {
        label: string,
        select: vscode.TextDocument,
    };

    const items: TPick[] = visibleListAhk.map((select: vscode.TextDocument, i: number): TPick => ({
        label: `${i} -> ${select.fileName}`,
        select,
    }));

    void vscode.window.showQuickPick<TPick>(items)
        .then((pick: TPick | undefined): null => {
            if (pick === undefined) return null;
            const { select } = pick;
            log.info(`select "${select.fileName}"`);
            void AnalysisFuncReference(select);
            return null;
        });
    return null;
}
