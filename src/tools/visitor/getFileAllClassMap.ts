import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getFileAllClass } from './getFileAllClassList';

type TClassMap = ReadonlyMap<string, CAhkClass>;

const wm = new WeakMap<TAstRoot, TClassMap>();

export function getFileAllClassMap(ASTRoot: TAstRoot): TClassMap {
    const cache: TClassMap | undefined = wm.get(ASTRoot);
    if (cache !== undefined) return cache;

    type TMapMake = [string, CAhkClass];
    const result: TClassMap = new Map<string, CAhkClass>(
        getFileAllClass(ASTRoot)
            .map((ahkFunc: CAhkClass): TMapMake => [ahkFunc.upName, ahkFunc]),
    );

    wm.set(ASTRoot, result);

    return result;
}
