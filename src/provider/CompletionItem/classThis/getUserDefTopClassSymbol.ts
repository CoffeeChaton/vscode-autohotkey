import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { Detecter } from '../../../core/Detecter';

export function getUserDefTopClassSymbol(keyUpName: string): CAhkClass | null {
    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkSymbolList: undefined | readonly TTopSymbol[] = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;

        for (const AhkSymbol of AhkSymbolList) {
            if (
                AhkSymbol instanceof CAhkClass
                && keyUpName === AhkSymbol.upName
            ) {
                return AhkSymbol;
            }
        }
    }
    return null;
}
