import { enumLog } from '../enumErr';

export function inCommentBlock(textRaw: string, CommentBlock: boolean): boolean {
    if (CommentBlock) {
        if ((/^\s*\*\//u).test(textRaw)) { // textRaw.indexOf('*/') > -1
            return false;
        }
    } else if ((/^\s*\/\*/u).test(textRaw)) { // textRaw.indexOf('/*') > -1
        return true;
    }
    return CommentBlock;
}

/* eslint-disable no-magic-numbers */
export const enum EDocBlock {
    other = 0, // false
    inDocCommentBlockStart = 1, // /**
    inDocCommentBlockMid = 2, //
    inDocCommentBlockEnd = 3, // */
}

export function docCommentBlock(textRaw: string, flag: EDocBlock): EDocBlock {
    if (
        flag === EDocBlock.other
        || flag === EDocBlock.inDocCommentBlockEnd
    ) {
        return (/^\s*\/\*{2}/u).test(textRaw) // textRaw.indexOf('/**') > -1
            ? EDocBlock.inDocCommentBlockStart
            : EDocBlock.other;
    }

    if (
        flag === EDocBlock.inDocCommentBlockStart
        || flag === EDocBlock.inDocCommentBlockMid
    ) {
        return (/^\s*\*\//u).test(textRaw) // textRaw.indexOf('*/') > -1
            ? EDocBlock.inDocCommentBlockEnd
            : EDocBlock.inDocCommentBlockMid;
    }

    // NEVER-----------------------------------
    enumLog(flag);
    return EDocBlock.other;
}
