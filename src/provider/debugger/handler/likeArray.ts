import { toArray } from '../Base64';
import { TDbgpProperty } from '../DebugTypeEnum';

export function likeArray(property: TDbgpProperty, name: string | undefined): boolean {
    if (name && (/^\[\d+\]$/u).test(name)) return true;
    if (!property.property) return false;

    return toArray(property.property)
        .some((childProperty) => {
            const attrName = childProperty.attr?.name;
            return (!attrName)
                ? false
                : (/\[\d+\]/u).test(attrName);
        });
}
