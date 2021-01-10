import { TValArray } from '../globalEnum';
import { Detecter } from './Detecter';

type TGlobalValDef = {
    readonly fsPath: string;
    readonly valName: string;
    readonly context: TValArray;
};

export function getGlobalValDef(regex: RegExp): null | TGlobalValDef {
    for (const [fsPath, TGValMap] of Detecter.globalValMap) {
        for (const [valName, context] of TGValMap) {
            if (valName.search(regex) > -1) {
                return { fsPath, valName, context };
            }
        }
    }
    return null;
}
