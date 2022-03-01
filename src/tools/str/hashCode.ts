/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
export function hashCode(s: string): number {
    const enum EHash {
        // eslint-disable-next-line no-magic-numbers
        x = 31,
    }

    let h = 0;
    for (let i = 0; i < s.length; i++) {
        // eslint-disable-next-line no-bitwise
        h = Math.imul(EHash.x, h) + s.charCodeAt(i) | 0;
    }

    return h;
}
