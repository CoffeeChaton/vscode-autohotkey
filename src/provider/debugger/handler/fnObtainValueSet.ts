export function fnObtainValueSet(value: string): {
    type: string;
    value: string;
    isVariable: boolean;
} {
    const exec = (/^(?:()|"(.*)"|(true|false)|([+-]?\d+)|([+-]?\d+\.[+-]?\d+)|([\w\d]+))$/si).exec(value);
    if (!exec) throw new Error(`"${value}" is invalid value.--775--33-16--`);

    const [, blank, str, bool, int, float, varName] = exec;
    if (blank !== undefined) {
        return {
            type: 'string',
            value: '',
            isVariable: false,
        };
    }
    if (str !== undefined) {
        return {
            type: 'string',
            value: str,
            isVariable: false,
        };
    }
    if (bool !== undefined) {
        return {
            type: 'string',
            value: (/true/i).test(bool)
                ? '1'
                : '0',
            isVariable: false,
        };
    }
    if (int !== undefined) {
        return {
            type: 'integer',
            value: int,
            isVariable: false,
        };
    }
    if (float !== undefined) {
        return {
            type: 'float',
            value: float,
            isVariable: false,
        };
    }
    return {
        type: '',
        value: varName,
        isVariable: true,
    };
}
