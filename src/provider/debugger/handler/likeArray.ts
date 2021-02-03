import { TDbgpProperty } from '../DebugTypeEnum';
import { toArray } from '../Base64';

export function likeArray(property: TDbgpProperty, name: string | undefined): boolean {
    if (name && (/^\[\d\d*\]$/).test(name)) return true;
    if (!property.property) return false;

    return toArray(property.property)
        .some((childProperty) => {
            const attrName = childProperty.attr?.name;
            return (!attrName)
                ? false
                : (/\[[0-9]+\]/).test(attrName);
        });
}
