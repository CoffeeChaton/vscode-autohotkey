import { EValType } from '../../globalEnum';
import { enumErr } from '../../tools/enumErr';

export function getAhkTypeName(e: EValType): 'static' | 'args' | 'global' | 'local' | 'normal' {
    switch (e) {
        case EValType.Static:
            return 'static';
        case EValType.args:
            return 'args';
        case EValType.global:
            return 'global';
        case EValType.local:
            return 'local';
        case EValType.normal:
            return 'normal';
        default:
            return enumErr(e);
    }
}
