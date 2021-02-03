/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
/* eslint-disable immutable/no-mutation */
/* eslint-disable immutable/no-this */

import { Handles, Scope, Variable } from 'vscode-debugadapter';
import {
    EVarScope, EVarScopeStr, TAhkVariable, TDbgpProperty, TDbgpPropertyAttr,
} from '../DebugTypeEnum';
import { toArray } from '../Base64';
import { likeArray } from './likeArray';
import { buildVariableValue } from './buildVariableValue';
import { enumLog } from '../../../tools/enumErr';

function getLikeArrayLength(property: TDbgpProperty): number {
    if (!property.property) return 0;
    const properties: TDbgpProperty[] = toArray(property.property);
    if (properties.length === 0) return 0;

    for (let i = properties.length - 1; i > 0; i--) {
        const match = properties[i]?.attr?.name?.match(/\[([0-9]+)\]/);
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
    attr, content, faClassname: classname, isLikeArray, length,
}: TFormatPropertyValue): string {
    const aType = attr.type;
    if (!TESTAttrTypeList.includes(aType)) {
        TESTAttrTypeList.push(aType);
        console.log('--77--51--aType', aType);
    }
    const str: WithImplicitCoercion<string> = content ?? '';
    const encoding: BufferEncoding | undefined = attr.encoding;
    const primitive = Buffer.from(str, encoding).toString();
    switch (aType) {
        case 'integer': return primitive;
        case 'float': return primitive;
        case 'string': return `"${primitive}"`;
        case 'object': {
            if (isLikeArray) return `Array(${length})`;

            const attrClassname = attr.classname;
            if (!TESTAttrClassname.includes(attrClassname)) {
                console.log('18-55--44-attrClassname', attrClassname);
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

    if (classname === undefined) return 'classname undefined-1';
    if (classname === 'undefined') return 'classname undefined-2';
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
    property, attr, classname, fullname, ref, name,
}: TParseTail): Variable {
    const isLikeArray = likeArray(property, name);
    const length = getLikeArrayLength(property);

    const content = property.content;
    const value = formatPropertyValue({
        attr, content, faClassname: classname, isLikeArray, length,
    });

    const indexedVariables = (isLikeArray && length > 100)
        ? length
        : undefined;
    const namedVariables = (isLikeArray && length > 100)
        ? 1
        : undefined;

    const ed = new Variable(fullname,
        value,
        ref,
        indexedVariables,
        namedVariables);
    //  ed.type = typeAttr;
    return ed;
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
        switch (scopeOrVar) {
            case EVarScopeStr.Local: return EVarScope.LOCAL;
            case EVarScopeStr.Global: return EVarScope.GLOBAL;
            default: return scopeOrVar.scope;
        }
    }

    public getVarByRef(ref: number): TAhkVariable {
        const ed: TAhkVariable | EVarScopeStr = this.variableHandles.get(ref);
        switch (ed) {
            case EVarScopeStr.Local:
            case EVarScopeStr.Global:
                console.error('--81--55--VariableHandler ~ getVarByRef ~ ref', ref);
                throw new Error('--84--93--55using ERR');
            default: return ed;
        }
    }

    public getVarByFullname(fullname: string): TAhkVariable | undefined {
        return this.variableMap.get(fullname);
    }

    public getArrayValue(ref: number, start: number, count: number): Variable[] | PromiseLike<Variable[]> {
        const ahkVar = this.getVarByRef(ref);
        const message = 'VariableHandler ~ getArrayValue ~ ahkVar';
        console.log(message, ahkVar);
        throw new Error(message);
        // const aValue = ahkVar.value;
        // const message = 'VariableHandler ~ getArrayValue ~ aValue';
        // console.log(message, aValue);
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
            console.log('Error --86--11--34-- !response.property', response);
            throw new Error('--86--74--35--, !response.property');
        }

        const tf = (!Array.isArray(temp) && temp.content);
        const responseFix2 = tf ? response : temp;

        if (Array.isArray(responseFix2)) {
            console.log('VariableHandler ~ parsePropertyget ~ response', response);
            throw new Error('--85--31--69--Array.isArray(responseFix2)');
        }

        const ed = this.parse(responseFix2, scope);
        return ed;
    }

    public parse(response: TDbgpProperty, scope: number): Variable[] {
        const classname = response.attr?.classname;
        if (classname) {
            console.log('VariableHandler ~ parse ~ response', response);
        }

        const temp: TDbgpProperty | TDbgpProperty[] | undefined = response.property;
        if (temp === undefined) {
            const attr = response.attr;

            if (!attr) return [];
            if (attr.type === 'undefined' && !classname) {
                console.log('--83--55--44attr.type === undefined', response);
                return [];
            }

            const message = 'VariableHandler ~ parse ~ attr === [] ---94--53--75, response';
            console.log(message, response);
            return [];
        }

        const parseEd: Variable[] = [];
        toArray(temp)
            .forEach((property) => {
                if (!property) return;

                const { attr, content } = property;
                if (!attr) return;

                const { fullname, name, type: typeAttr } = attr;

                if (typeAttr === undefined) {
                    console.error('ERROR--65--31--45 response', response);
                    const message = 'ERROR--91--37--55 --some undefined of typeAttr';
                    console.error(message, property);
                    return;
                }

                if (!fullname || !name || !typeAttr) {
                    const message = '--91--34--55 --some undefined of element of property.attr';
                    console.log(message, property);
                    return;
                }

                const ahkVar = {
                    scope,
                    frameId: scope === EVarScope.GLOBAL ? -1 : this.frameId,
                    name: fullname,
                    value: content ? buildVariableValue(property, attr, content) : '',
                };
                this.variableMap.set(fullname, ahkVar);
                const ref = typeAttr !== 'object' ? 0 : this.variableHandles.create(ahkVar);
                if (name === 'Name' || classname === 'Func') {
                    console.log('VariableHandler ~ .forEach ~ response', response);
                }

                const ed = parseTail({
                    property, attr, classname, name, fullname, ref,
                });
                parseEd.push(ed);
            });
        return parseEd;
    }
}
