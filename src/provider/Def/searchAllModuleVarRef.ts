import * as vscode from 'vscode';
import { pm } from '../../core/ProjectManager';

export function searchAllModuleVarRef(wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b(${wordUp})\\b`, 'iug');
    const refFn = (lineStr: string): IterableIterator<RegExpMatchArray> => lineStr.matchAll(reg);

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        for (const { line, lStr } of DocStrMap) {
            for (const ma of refFn(lStr)) {
                const col: number | undefined = ma.index;
                if (col === undefined) continue;

                List.push(
                    new vscode.Location(
                        uri,
                        new vscode.Range(
                            new vscode.Position(line, col),
                            new vscode.Position(line, col + wordUp.length),
                        ),
                    ),
                );
            }
        }
    }

    return List; // ssd -> 9~11ms (if not gc)
}
