import path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkInclude, TPathMsg } from '../AhkSymbol/CAhkInclude';
import { EInclude } from '../AhkSymbol/CAhkInclude';
import { pm } from '../core/ProjectManager';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { enumLog } from '../tools/enumErr';
import { collectInclude } from './ListAllInclude';

type TIncludeMap = Map<string, CAhkInclude[]>;

type TPick2 = {
    label: string;
    fsPath: string;
};

function getIncludeMap(): TIncludeMap {
    const map: Map<string, CAhkInclude[]> = new Map<string, CAhkInclude[]>();
    for (const [k, v] of pm.DocMap) { // keep output order
        const list: CAhkInclude[] = collectInclude(v.AST);

        if (list.length > 0) {
            map.set(k, list);
        }
    }
    return map;
}

function getTPickList(map: TIncludeMap): readonly TPick2[] {
    const items: TPick2[] = [];
    let i = 0;
    for (const fsPath of map.keys()) {
        items.push({ label: `${i} -> ${fsPath}`, fsPath });
        i++;
    }

    return items;
}

function getSearchPath(docPath: string, maybePathList: TPathMsg): string {
    const { type, mayPath } = maybePathList;

    switch (type) {
        case EInclude.A_LineFile:
        case EInclude.Absolute:
        case EInclude.Relative:
            return mayPath;

        case EInclude.isUnknown:
            return path.join(path.dirname(docPath), mayPath);

        case EInclude.Lib:
            return ''; // FIXME  EInclude.Lib:

        default:
            enumLog(type);
            return '';
    }
}

type TTreeResult = {
    deep: number;
    name: string;
    hasFile: boolean;
    searchPath: string;
};

function IncludeTree(docPath: string, searchStack: string[], IncludeMap: TIncludeMap, errMsg: string[]): TTreeResult[] {
    const deep: number = searchStack.length + 1;

    const list: CAhkInclude[] | undefined = IncludeMap.get(docPath);
    if (list === undefined) return [];

    const result: TTreeResult[] = [];

    for (const { name, maybePathList } of list) {
        const searchPath: string = getSearchPath(docPath, maybePathList);

        const hasFile: boolean = pm.DocMap.has(searchPath);
        if (!hasFile) errMsg.push(name);

        result.push({
            deep,
            name,
            hasFile,
            searchPath,
        });

        if (searchPath === '') {
            result.push({
                deep,
                name: `${name} TODO of <Lib Mode>`,
                hasFile: false,
                searchPath: 'TODO of <Lib Mode>',
            });
        } else {
            result.push(...IncludeTree(searchPath, [...searchStack, searchPath], IncludeMap, errMsg));
        }
    }

    return result;
}

function treeResult2StrList(result: TTreeResult[]): string[] {
    //     const space: string = '    '.repeat(deep);

    const msg: string[] = [];
    // eslint-disable-next-line no-magic-numbers
    const max = Math.max(...result.map((v: TTreeResult): number => v.deep * 4 + v.name.length));

    for (
        const {
            deep,
            name,
            hasFile,
            searchPath,
        } of result
    ) {
        const hasFileStr = hasFile
            ? 'OK'
            : 'NG';

        const space: string = '    '.repeat(deep);
        const head = `${space}${name}`.padEnd(max);
        msg.push(`${head}    |${hasFileStr}|    ${searchPath}`);
    }
    return msg;
}

// fsPath: string, searchStack: string[]
export async function ListIncludeTree(): Promise<null> {
    const map: TIncludeMap = getIncludeMap();
    const select: TPick2 | undefined = await vscode.window.showQuickPick<TPick2>(getTPickList(map), {
        title: 'Select project entry, just support ahk_L v1',
    });
    if (select === undefined) return null;

    const t1: number = Date.now();
    const errMsg: string[] = [];

    OutputChannel.clear();
    OutputChannel.appendLine([
        '[neko-help] List All #Include v2',
        '',
        select.fsPath,
        ...treeResult2StrList(IncludeTree(select.fsPath, [], map, errMsg)),
        '\n',
        `Done in ${Date.now() - t1} ms`,
    ].join('\n'));

    if (errMsg.length > 0) {
        OutputChannel.appendLine('\n\n[neko-help] Error');
        OutputChannel.appendLine(errMsg.join('\n'));
    }

    OutputChannel.show();

    return null;
}
