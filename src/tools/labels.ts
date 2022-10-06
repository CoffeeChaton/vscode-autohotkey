import { CAhkLabel } from '../AhkSymbol/CAhkLine';
import type { TAhkSymbol, TAstRoot } from '../AhkSymbol/TAhkSymbolIn';
import { pm } from '../core/ProjectManager';

type TLabelMapRW = Map<string, CAhkLabel>;

function findAllLabelMapCore(ch: readonly TAhkSymbol[], map: TLabelMapRW): void {
    for (const AhkSymbol of ch) {
        if (AhkSymbol.children.length > 0) {
            findAllLabelMapCore(AhkSymbol.children, map);
        } else if (AhkSymbol instanceof CAhkLabel) {
            map.set(AhkSymbol.upName, AhkSymbol);
        }
    }
}

const wm = new WeakMap<TAstRoot, TLabelMapRW>();

function findAllLabelMap(AST: TAstRoot): TLabelMapRW {
    const cache: TLabelMapRW | undefined = wm.get(AST);
    if (cache !== undefined) return cache;

    const LabelMap: TLabelMapRW = new Map();
    findAllLabelMapCore(AST, LabelMap);

    wm.set(AST, LabelMap);
    return LabelMap;
}

export function findLabel(wordUpCase: string): CAhkLabel | null {
    for (const { AST } of pm.getDocMapValue()) {
        const label: CAhkLabel | undefined = findAllLabelMap(AST).get(wordUpCase);
        if (label !== undefined) return label;
    }
    return null;
}
