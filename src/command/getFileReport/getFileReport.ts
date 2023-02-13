import * as vscode from 'vscode';
import { AnalysisFuncReferenceCore } from '../AnalysisFuncReference/AnalysisFuncReference';
import { cmd2TryFindGlobalVar } from './cmd2TryFindGlobalVar';

export function getFileReport(document: vscode.TextDocument): null {
    type TPick = {
        label: string,
        fn: () => void,
    };

    void vscode.window.showQuickPick<TPick>([
        { label: '1 -> Analysis this file def func Reference', fn: (): null => AnalysisFuncReferenceCore(document) },
        { label: '2 -> try to find this file global-var', fn: (): null => cmd2TryFindGlobalVar(document) },
        { label: '3 -> TODO', fn: (): void => void vscode.window.showInformationMessage('under construction...') },
    ])
        .then((pick: TPick | undefined): null => {
            //
            pick?.fn();
            return null;
        });

    return null;
}
