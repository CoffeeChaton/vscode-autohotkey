import { TValArray } from '../globalEnum';
import { globalValMap } from './globalValMap';

type TGlobalValDef = {
    readonly fsPath: string;
    readonly valName: string;
    readonly context: TValArray;
};

export function getGlobalValDef(regex: RegExp): null | TGlobalValDef {
    for (const [fsPath, TGValMap] of globalValMap) {
        for (const [valName, context] of TGValMap) {
            if (valName.search(regex) > -1) {
                return { fsPath, valName, context };
            }
        }
    }
    return null;
}
