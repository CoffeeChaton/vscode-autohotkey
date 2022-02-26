/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import { Handles, Scope, Variable } from '@vscode/debugadapter';
import { enumLog } from '../../../tools/enumErr';
import { toArray } from '../Base64';
import {
    EVarScope,
    EVarScopeStr,
    TAhkVariable,
    TDbgpProperty,
    TDbgpPropertyAttr,
} from '../DebugTypeEnum';
import { buildVariableValue } from './buildVariableValue';
import { likeArray } from './likeArray';

function getLikeArrayLength(property: TDbgpProperty): number {
    if (!property.property) return 0;
    const properties: TDbgpProperty[] = toArray(property.property);
    if (properties.length === 0) return 0;

    for (let i = properties.length - 1; i > 0; i--) {
        const match = properties[i]?.attr?.name?.match(/\[(\d+)]/u);
        if (match && match[1]) return parseInt(match[1], 10);
    }
    return 0;
}

type TFormatPropertyValue = {
    attr: TDbgpPropertyAttr;
    content: string | undefined;
    faClassname: string | undefined;
    isLikeArray: boolean;
    length: number;
};

const TESTAttrTypeList: (string | undefined)[] = ['integer', 'undefined', 'object', 'string', 'float'];
const TESTAttrClassname: (TDbgpPropertyAttr['classname'])[] = ['Object', 'Func', 'File', 'BoundFunc', 'WebBrowser'];

/** formats a dbgp property value for VS Code */
function formatPropertyValue({
    attr,
    content,
    faClassname: classname,
    isLikeArray,
    length,
}: TFormatPropertyValue): string {
    const aType = attr.type;
    if (!TESTAttrTypeList.includes(aType)) {
        TESTAttrTypeList.push(aType);
    }
    const str: WithImplicitCoercion<string> = content ?? '';
    const { encoding } = attr;
    const primitive = Buffer.from(str, encoding).toString();
    // dprint-ignore
    switch (aType) {
        case 'integer': return primitive;
        case 'float': return primitive;
        case 'string': return `"${primitive}"`;
        case 'object': {
            if (isLikeArray) return `Array(${length})`;

            const attrClassname = attr.classname;
            if (!TESTAttrClassname.includes(attrClassname)) {
                TESTAttrClassname.push(attrClassname);
            }
            if (attrClassname) return `${attrClassname} Object`;
            break;
        }
        case 'undefined':
        case undefined:
            break;
        default:
            enumLog(aType);
            break;
    }

    if (classname === undefined) return 'undefined of Not defined';
    if (classname === 'undefined') return 'undefined-2(neko-help-88)';

    return `${classname}`;
}

type TParseTail = {
    property: TDbgpProperty;
    attr: TDbgpPropertyAttr;
    classname: string | undefined;
    fullname: string;
    name: string;
    ref: number;
};

function parseTail({
    property,
    attr,
    classname,
    fullname,
    ref,
    name,
}: TParseTail): Variable {
    const isLikeArray = likeArray(property, name);
    const length = getLikeArrayLength(property);

    const { content } = property;
    const value = formatPropertyValue({
        attr,
        content,
        faClassname: classname,
        isLikeArray,
        length,
    });

    const indexedVariables = (isLikeArray && length > 100)
        ? length
        : undefined;
    const namedVariables = (isLikeArray && length > 100)
        ? 1
        : undefined;

    //  ed.type = typeAttr;
    return new Variable(
        fullname,
        value,
        ref,
        indexedVariables,
        namedVariables,
    );
}

/**
 * Variable Handler
 */
export class VariableHandler {
    private readonly variableHandles = new Handles<EVarScopeStr | TAhkVariable>();

    private readonly variableMap = new Map<string, TAhkVariable>();

    private frameId = 0; // ??

    public getScopeByRef(ref: number): number {
        const scopeOrVar: TAhkVariable | EVarScopeStr = this.variableHandles.get(ref);
        // dprint-ignore
        switch (scopeOrVar) {
            case EVarScopeStr.Local: return EVarScope.LOCAL;
            case EVarScopeStr.Global: return EVarScope.GLOBAL;
            default: return scopeOrVar.scope;
        }
    }

    public getVarByRef(ref: number): TAhkVariable | EVarScopeStr {
        const ed: TAhkVariable | EVarScopeStr = this.variableHandles.get(ref);
        switch (ed) {
            case EVarScopeStr.Local:
            case EVarScopeStr.Global:
                return ed;
            default:
                return ed;
        }
    }

    public getVarByFullname(fullname: string): TAhkVariable | undefined {
        return this.variableMap.get(fullname);
    }

    public getArrayValue(ref: number, _start: number, _count: number): Variable[] | PromiseLike<Variable[]> {
        const ahkVar: EVarScopeStr | TAhkVariable = this.getVarByRef(ref);
        const message = 'VariableHandler ~ getArrayValue ~ ahkVar';
        console.error(message, ahkVar);
        throw new Error(message);
        // const aValue = ahkVar.value;
        // const message = 'VariableHandler ~ getArrayValue ~ aValue';
        // throw new Error(message);

        // return (aValue)
        //     .slice(start, start + count)
        //     .map((value, index) => new Variable(`[${start + index + 1}]`, value));
    }

    public scopes(frameId: number): Scope[] {
        this.frameId = frameId;
        return [
            new Scope(EVarScopeStr.Local, this.variableHandles.create(EVarScopeStr.Local), true),
            new Scope(EVarScopeStr.Global, this.variableHandles.create(EVarScopeStr.Global), true),
        ];
    }

    public getFrameId(): number {
        return this.frameId;
    }

    public parsePropertyget(response: TDbgpProperty, scope: number): Variable[] {
        if (!response) throw new Error(`scope : ${scope} --94--66--931`);

        const temp = response.property;
        if (!temp) {
            console.error('Error --86--11--34-- !response.property', response);
            throw new Error('--86--74--35--, !response.property');
        }

        const tf = (!Array.isArray(temp) && temp.content);
        const responseFix2 = tf
            ? response
            : temp;

        if (Array.isArray(responseFix2)) {
            console.error('VariableHandler ~ parsePropertyget ~ response', response);
            throw new Error('--85--31--69--Array.isArray(responseFix2)');
        }

        return this.parse(responseFix2, scope);
    }

    // eslint-disable-next-line max-statements
    public parse(response: TDbgpProperty, scope: number): Variable[] {
        const classname = response.attr?.classname;

        const temp: TDbgpProperty | TDbgpProperty[] | undefined = response.property;
        if (temp === undefined) {
            const { attr } = response;

            if (!attr) return [];
            const { type, fullname } = attr;
            if (type === 'undefined' || !type || !classname || !fullname) {
                return [];
            }

            return [];
        }

        const parseEd: Variable[] = [];
        const tempArr = toArray(temp);
        for (const property of tempArr) {
            if (!property) continue;

            const { attr, content } = property;
            if (!attr) continue;

            const { fullname, name, type: typeAttr } = attr;

            if (typeAttr === undefined) {
                console.error('ERROR--65--31--45 response', response);
                const message = 'ERROR--91--37--55 --some undefined of typeAttr';
                console.error(message, property);
                continue;
            }

            if (!fullname || !name || !typeAttr) {
                const message = '--91--34--55 --some undefined of element of property.attr';
                console.error(message, property);
                continue;
            }

            const ahkVar = {
                scope,
                frameId: scope === EVarScope.GLOBAL
                    ? -1
                    : this.frameId,
                name: fullname,
                value: content
                    ? buildVariableValue(property, attr, content)
                    : '', // TODO : '' address:'49519792'
            };
            this.variableMap.set(fullname, ahkVar);
            const ref = typeAttr !== 'object'
                ? 0
                : this.variableHandles.create(ahkVar);

            const ed = parseTail({
                property,
                attr,
                classname,
                name,
                fullname,
                ref,
            });
            parseEd.push(ed);
        }
        return parseEd;
    }
}
