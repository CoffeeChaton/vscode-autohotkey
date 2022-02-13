/* eslint-disable security/detect-non-literal-regexp */
export function ahkValRegex(valName: string): RegExp {
    return new RegExp(`(?<![.\`%])\\b${valName}\\b(?!%)`, 'i');
}
export function ahkValDefRegex(valName: string): RegExp {
    return new RegExp(`(?<![.\`%])\\b${valName}\\b\\s*:?=`, 'i');
}

// not great
export function ahkStaticValDefRegex(valName: string): RegExp {
    return new RegExp(`\\bstatic\\b.*?(?<![.\`%])\\b${valName}\\b(?!%)`, 'i');
}
export function ahkGlobalValDefRegex(valName: string): RegExp {
    return new RegExp(`\\bglobal\\b.*?(?<![.\`%])\\b${valName}\\b(?!%)`, 'i');
}
export function ahkLocalValDefRegex(valName: string): RegExp {
    return new RegExp(`\\blocal\\b.*?(?<![.\`%])\\b${valName}\\b(?!%)`, 'i');
}

export function ahkVarSetCapacityDefRegex(valName: string): RegExp {
    return new RegExp(`\\bVarSetCapacity\\(\\s*${valName}\\b(?:\\s|,)`, 'i');
}
