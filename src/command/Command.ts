import * as vscode from 'vscode';
import { DeepAnalysisAllFiles } from './DeepAnalysisAllFiles';
import { pressureTest } from './DevMode';
import { FormatAllFile } from './FormatAllFile';
import { ListAllFuncMain } from './ListAllFunc';
import { ListAllInclude } from './ListAllInclude';
import type { TPick } from './TPick';
import { fnRefreshResource } from './UpdateCache';

export function statusBarClick(): void {
    type TCommand = TPick<void>;

    const items: TCommand[] = [
        { label: '0 -> Refresh Resource', fn: fnRefreshResource },
        { label: '1 -> dev tools', fn: pressureTest },
        { label: '2 -> list all #Include', fn: ListAllInclude },
        { label: '3 -> list all Function()', fn: ListAllFuncMain },
        { label: '4 -> DeepAnalysis All File', fn: DeepAnalysisAllFiles },
        { label: '5 -> format All File', fn: FormatAllFile },
    ];

    void vscode.window.showQuickPick<TCommand>(items)
        .then((pick: TPick<void> | undefined): null => {
            //
            //
            void pick?.fn();
            return null;
        });
}
