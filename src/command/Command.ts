import * as vscode from 'vscode';
import { getDocUriStr } from '../configUI';
import { DeepAnalysisAllFiles } from './DeepAnalysisAllFiles';
import { pressureTest } from './DevMode';
import { FormatAllFile } from './FormatAllFile';
import { ListAllFunc, ListAllFuncSort } from './ListAllFunc';
import { ListAllInclude } from './ListAllInclude';
import { TPick } from './TPick';
import { fnRefreshResource } from './UpdateCache';

export async function statusBarClick(): Promise<void> {
    type TCommand = TPick<void>;

    const items: TCommand[] = [
        { label: '0 -> Refresh Resource', fn: fnRefreshResource },
        { label: '1 -> dev tools', fn: pressureTest },
        { label: '2 -> list all #Include', fn: ListAllInclude },
        { label: '3 -> list all Function()', fn: (): null => ListAllFunc(false) },
        { label: '4 -> list all Function() ; link', fn: (): null => ListAllFunc(true) },
        { label: '5 -> list all Function() sort a -> z', fn: (): null => ListAllFuncSort(false) },
        { label: '6 -> list all Function() sort z -> a', fn: (): null => ListAllFuncSort(true) },
        { label: '7 -> DeepAnalysis All File', fn: DeepAnalysisAllFiles },
        { label: '8 -> format All File', fn: FormatAllFile },
    ];

    const pick: TPick<void> | undefined = await vscode.window.showQuickPick<TCommand>(items);

    void pick?.fn();
}

export function openDocs(): void {
    const Uri: vscode.Uri = vscode.Uri.parse(getDocUriStr());
    void vscode.commands.executeCommand(
        'vscode.open',
        Uri,
    );
    //  .vscode.open();
    // this.run(await this.createTemplate(text));
}
