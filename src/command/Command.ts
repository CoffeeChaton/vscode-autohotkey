import * as vscode from 'vscode';
import { DevLoopOfClearOutlineCache } from './DevMode';
import { ListAllFunc, ListAllFuncSort } from './ListAllFunc';
import { ListAllInclude } from './ListAllInclude';
import { UpdateCacheOfNekoHelp } from './UpdateCacheOfNekoHelp';

type TPick = {
    label: string;
    fn: () => Promise<null>;
} | {
    label: string;
    fn: () => null;
};

// eslint-disable-next-line require-await
const fn0 = async (): Promise<null> => UpdateCacheOfNekoHelp(false);

export async function statusBarClick(): Promise<void> {
    const items: TPick[] = [
        { label: '0 -> update Cache', fn: fn0 },
        { label: '1 -> dev tools', fn: DevLoopOfClearOutlineCache },
        { label: '2 -> list all #Include', fn: ListAllInclude },
        { label: '3 -> list all Function()', fn: (): null => ListAllFunc(false) },
        { label: '4 -> list all Function() ; link', fn: (): null => ListAllFunc(true) },
        { label: '5 -> list all Function() sort a -> z', fn: (): null => ListAllFuncSort(false) },
        { label: '6 -> list all Function() sort z -> a', fn: (): null => ListAllFuncSort(true) },
    ];

    const pick = await vscode.window.showQuickPick<TPick>(items);

    pick?.fn();
}
