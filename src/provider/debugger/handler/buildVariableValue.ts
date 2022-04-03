import { enumLog } from '../../../tools/enumErr';
import { mapToStr } from '../../../tools/str/mapToStr';
import { base64ToStr, toArray } from '../Base64';
import { TDbgpProperty, TDbgpPropertyAttr } from '../DebugTypeEnum';
import { likeArray } from './likeArray';

function getContent(child: TDbgpProperty): string | null {
    const { content, property } = child;
    if (content) return content;
    if (!property) return null;

    if (Array.isArray(property)) {
        for (const element of property) {
            const t1 = element.content;
            if (t1) return t1;
        }
    } else {
        const t1 = property.content;
        if (t1) return t1;
    }

    return null;
}

function buildVariableValueObj(attr: TDbgpPropertyAttr, property: TDbgpProperty): string {
    if (!property.property) return '{}';

    const children = toArray(property.property);
    if (attr.classname === 'Object' && likeArray(property, attr.name)) {
        const ahkArr = children.map((v) => base64ToStr(v.content || '""'));
        return JSON.stringify(ahkArr);
    }
    // k = child.attr.fullName
    // v = string
    const mapA = new Map<string, string>();
    children.forEach((child) => {
        const key = child?.attr?.name;
        if (key === undefined) return;
        const chContent = getContent(child);
        const value = chContent
            ? base64ToStr(chContent)
            : 'undefined--71-53';
        mapA.set(key, value);
    });
    return mapToStr(mapA);
}

export function buildVariableValue(property: TDbgpProperty, attr: TDbgpPropertyAttr, content: string): string {
    const aType = attr.type;
    const primitive = base64ToStr(content);
    switch (aType) {
        case 'integer':
            return primitive;
        case 'float':
            return primitive;
        case 'string':
            return `"${primitive}"`;
        case 'object':
            return buildVariableValueObj(attr, property);
        case 'undefined':
            return 'type undefined';
        case undefined:
            break;
        default:
            enumLog(aType);
            break;
    }

    return attr.classname ?? 'attr?.classname';
}
