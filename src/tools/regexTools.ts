/* eslint-disable security/detect-non-literal-regexp */
export function ahkValRegex(valName: string): RegExp {
    return new RegExp(`(?<![.])\\b${valName}\\b`, 'iu');
}

export function ahkValDefRegex(valName: string): RegExp {
    return new RegExp(`(?<![.])\\b${valName}\\b\\s*:?=`, 'iu');
}
