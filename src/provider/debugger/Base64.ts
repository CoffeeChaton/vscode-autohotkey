export function toArray<T>(arr: T | T[]): T[] {
    return Array.isArray(arr)
        ? arr
        : [arr];
}
/**
 * base64 to string
 */
export function base64ToStr(base64: string): string {
    return Buffer.from(base64, 'base64').toString();
}
/**
 * string to base64
 */
export function strToBas64(data: string): string {
    return Buffer.from(data).toString('base64');
}
