export function mapToStr(mapA: Map<string, string> | string): string {
    if (typeof mapA === 'string') {
        return mapA;
    }
    const space4 = '    ';
    let tempStr = '{\n';
    mapA.forEach((v, k) => {
        tempStr += `${space4}${k}:${v},\n`;
    });
    tempStr += '}';
    return tempStr;
}
