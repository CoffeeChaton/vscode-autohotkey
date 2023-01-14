import { CAhkInclude } from '../AhkSymbol/CAhkInclude';
import type { TAhkSymbolList } from '../AhkSymbol/TAhkSymbolIn';
import { pm } from '../core/ProjectManager';
import { log } from '../provider/vscWindows/log';

export function collectInclude(AST: Readonly<TAhkSymbolList>): CAhkInclude[] {
    const List: CAhkInclude[] = [];
    for (const ahkInclude of AST) {
        if (ahkInclude instanceof CAhkInclude) {
            List.push(ahkInclude);
        } else {
            List.push(...collectInclude(ahkInclude.children));
        }
    }
    return List;
}

export function ListAllInclude(): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        const List: CAhkInclude[] = collectInclude(AST);

        if (List.length > 0) {
            AllList.push(`\n${uri.fsPath}`, ...List.map((ahkInclude) => ahkInclude.name));
        }
    }

    log.info([
        '[neko-help] List All #Include',
        ...AllList,
        '\n',
        `Done in ${Date.now() - t1} ms`,
    ].join('\n'));
    log.show();

    return null;
}
