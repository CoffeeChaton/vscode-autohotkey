import * as vscode from 'vscode';
import { AnalysisFuncReferenceCore } from '../AnalysisFuncReference/AnalysisFuncReference';

export function getFileReport(document: vscode.TextDocument): null {
    type TPick = {
        label: string,
        fn: () => void,
    };

    // FIXME:
    const TodoFn = (): void => void vscode.window.showInformationMessage('under construction...');
    void vscode.window.showQuickPick<TPick>([
        { label: '1 -> Analysis this file def func Reference', fn: (): null => AnalysisFuncReferenceCore(document) },
        { label: '2 -> TODO', fn: TodoFn },
    ])
        .then((pick: TPick | undefined): null => {
            //
            pick?.fn();
            return null;
        });

    return null;
}
