export function setPreFix(isByRef: boolean, isVariadic: boolean): string {
    const ByRef = isByRef
        ? 'ByRef '
        : '';
    const Variadic = isVariadic
        ? 'Variadic '
        : '';

    return `${ByRef}${Variadic}param`;
}
