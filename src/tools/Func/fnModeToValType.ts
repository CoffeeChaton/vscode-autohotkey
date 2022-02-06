import { EFnMode, EValType } from '../../globalEnum';
import { enumErr } from '../enumErr';

export function fnModeToValType(fnMode: EFnMode): EValType.local | EValType.global | EValType.Static {
    // dprint-ignore
    switch (fnMode) {
        case EFnMode.normal:
        case EFnMode.local: return EValType.local;
        case EFnMode.global: return EValType.global;
        case EFnMode.Static: return EValType.Static;
        default: return enumErr(fnMode);
    }
}
