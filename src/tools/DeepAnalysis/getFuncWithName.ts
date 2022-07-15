import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/Detecter';
import { Detecter } from '../../core/Detecter';

export function getFuncWithName(wordUP: string): CAhkFunc | null {
    const fsPaths: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPaths) {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        for (const DA of AhkSymbolList) {
            if (DA instanceof CAhkFunc && DA.upName === wordUP) {
                return DA;
            }
        }
    }
    return null;
}
