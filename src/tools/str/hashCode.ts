/* eslint-disable no-bitwise */
/* eslint-disable no-magic-numbers */
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
 * read more https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
 * @param {string} str a string
 * @return {number} a hash code value for the given string.
 */
export function hashCode(str: string): number {
    let hash = 0;
    let i = str.length;
    while (i > 0) {
        hash = (hash << 5) - hash + str.charCodeAt(--i) | 0;
    }
    return hash | 0;
}
