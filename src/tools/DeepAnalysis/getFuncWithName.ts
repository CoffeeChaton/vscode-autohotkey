import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter, TAhkFileData } from '../../core/Detecter';

export function getFuncWithName(wordUP: string): null | CAhkFunc {
    const fsPaths: string[] = Detecter.getDocMapFile();

    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        for (const DA of AhkSymbolList) {
            if (
                DA instanceof CAhkFunc
                // && DA.kind === vscode.SymbolKind.Function
                && DA.upName === wordUP
            ) {
                return DA;
            }
        }
    }
    return null;
}
